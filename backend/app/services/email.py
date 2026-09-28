import json
import logging
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime
from html import escape
from zoneinfo import ZoneInfo

from app.core.config import settings

log = logging.getLogger("uvicorn.error")

RESEND_URL = "https://api.resend.com/emails"
LOCAL_TZ = ZoneInfo("Europe/Belgrade")


@dataclass(frozen=True)
class OrderLine:
    name: str
    group_name: str
    quantity: int
    image_url: str | None


@dataclass(frozen=True)
class OrderSummary:
    """Plain copy of an order, safe to use after the request's DB session closes."""

    id: int
    name: str
    email: str
    phone: str | None
    note: str | None
    created_at: datetime
    lines: list[OrderLine]


def _absolute(url: str | None) -> str | None:
    if not url:
        return None
    return url if url.startswith("http") else f"{settings.SITE_URL.rstrip('/')}{url}"


def _render(order: OrderSummary) -> tuple[str, str, str]:
    total = sum(line.quantity for line in order.lines)
    when = order.created_at.astimezone(LOCAL_TZ).strftime("%d.%m.%Y, %H:%M")
    admin_url = f"{settings.SITE_URL.rstrip('/')}/admin/porosite/{order.id}"
    name = " ".join(order.name.split())  # no line breaks in the subject
    subject = f"Porosi e re #{order.id} - {name} ({total} copë)"

    rows = []
    for line in order.lines:
        img = _absolute(line.image_url)
        thumb = (
            f'<img src="{escape(img)}" width="48" height="48" alt="" '
            'style="display:block;width:48px;height:48px;object-fit:contain;border:1px solid #e4e4e4;background:#fff">'
            if img
            else '<div style="width:48px;height:48px;border:1px solid #e4e4e4;background:#f5f5f4"></div>'
        )
        rows.append(
            "<tr>"
            f'<td style="padding:10px 12px 10px 0;border-bottom:1px solid #e4e4e4;width:48px">{thumb}</td>'
            '<td style="padding:10px 12px 10px 0;border-bottom:1px solid #e4e4e4">'
            f'<div style="font-size:12px;color:#71717a">{escape(line.group_name)}</div>'
            f'<div style="font-size:14px;color:#0a0a0a;font-weight:600">{escape(line.name)}</div></td>'
            '<td style="padding:10px 0;border-bottom:1px solid #e4e4e4;text-align:right;font-size:16px;'
            f'font-weight:700;color:#0a0a0a;white-space:nowrap">&times;{line.quantity}</td>'
            "</tr>"
        )

    phone = escape(order.phone) if order.phone else "&ndash;"
    note = (
        '<p style="margin:24px 0 6px;font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:.08em">'
        "Shënimi i klientit</p>"
        f'<p style="margin:0;padding:12px 14px;background:#f5f5f4;font-size:14px;line-height:1.6;color:#0a0a0a;'
        f'white-space:pre-line">{escape(order.note)}</p>'
        if order.note
        else ""
    )

    html = f"""<!doctype html>
<html lang="sq"><body style="margin:0;padding:24px;background:#f5f5f4;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e4">
<tr><td style="height:4px;background:#c1121c"></td></tr>
<tr><td style="padding:28px 28px 8px">
  <p style="margin:0 0 6px;font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:.08em">NSH LIRIU &middot; Kërkesë për ofertë</p>
  <h1 style="margin:0;font-size:22px;color:#0a0a0a">Porosi e re #{order.id}</h1>
  <p style="margin:6px 0 0;font-size:14px;color:#71717a">{when} &middot; {len(order.lines)} produkte &middot; {total} copë</p>
</td></tr>
<tr><td style="padding:20px 28px 0">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#0a0a0a">
    <tr><td style="padding:4px 0;color:#71717a;width:90px">Klienti</td><td style="padding:4px 0;font-weight:600">{escape(order.name)}</td></tr>
    <tr><td style="padding:4px 0;color:#71717a">Email</td><td style="padding:4px 0"><a href="mailto:{escape(order.email)}" style="color:#0a0a0a">{escape(order.email)}</a></td></tr>
    <tr><td style="padding:4px 0;color:#71717a">Telefoni</td><td style="padding:4px 0">{phone}</td></tr>
  </table>
</td></tr>
<tr><td style="padding:20px 28px 0">
  <p style="margin:0 0 6px;font-size:12px;color:#71717a;text-transform:uppercase;letter-spacing:.08em">Produktet</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{"".join(rows)}</table>
  {note}
</td></tr>
<tr><td style="padding:28px">
  <a href="{escape(admin_url)}" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 20px">Hap porosinë në panel</a>
  <p style="margin:16px 0 0;font-size:12px;color:#71717a">Përgjigjuni këtij email-i për t'i shkruar direkt klientit.</p>
</td></tr>
</table>
</body></html>"""

    text_lines = [
        f"Porosi e re #{order.id} - {when}",
        "",
        f"Klienti: {order.name}",
        f"Email: {order.email}",
        f"Telefoni: {order.phone or '-'}",
        "",
        "Produktet:",
        *[
            f"  {line.quantity} x {line.name}" + (f" ({line.group_name})" if line.group_name else "")
            for line in order.lines
        ],
        f"Gjithsej: {total} copë",
    ]
    if order.note:
        text_lines += ["", "Shënimi i klientit:", order.note]
    text_lines += ["", f"Hape në panel: {admin_url}"]
    return subject, html, "\n".join(text_lines)


def send_new_order_email(order: OrderSummary) -> None:
    """Runs as a background task after the order is saved; never raises."""
    recipients = settings.order_notify_list
    if not settings.RESEND_API_KEY or not recipients:
        log.warning("Order #%s saved; email notification skipped (RESEND_API_KEY not set).", order.id)
        return

    subject, html, text = _render(order)
    body = json.dumps(
        {
            "from": settings.MAIL_FROM,
            "to": recipients,
            "reply_to": order.email,
            "subject": subject,
            "html": html,
            "text": text,
        }
    ).encode()
    request = urllib.request.Request(
        RESEND_URL,
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "liriu-api/1.0",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            log.info("Order #%s email sent (%s).", order.id, response.status)
    except urllib.error.HTTPError as err:
        detail = err.read().decode(errors="replace")[:300]
        log.error("Order #%s email failed: HTTP %s %s", order.id, err.code, detail)
    except Exception as err:  # network errors, timeouts
        log.error("Order #%s email failed: %s", order.id, err)
