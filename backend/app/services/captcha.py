import json
import logging
import urllib.error
import urllib.parse
import urllib.request

from fastapi import HTTPException, status

from app.core.config import settings

log = logging.getLogger("uvicorn.error")

VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"


def verify_captcha(token: str | None) -> None:
    """Validates a Cloudflare Turnstile token from a public form.

    No-ops when TURNSTILE_SECRET_KEY isn't configured, so the site keeps
    working before the keys are set. Once it is set, a missing, reused or
    invalid token is rejected with 400 - this runs on the backend so it can't
    be skipped by posting straight to the API.
    """
    if not settings.TURNSTILE_SECRET_KEY:
        return

    bad_captcha = HTTPException(
        status.HTTP_400_BAD_REQUEST, "Verifikimi anti-spam dështoi. Rifreskoni faqen dhe provoni përsëri."
    )
    if not token:
        raise bad_captcha

    data = urllib.parse.urlencode({"secret": settings.TURNSTILE_SECRET_KEY, "response": token}).encode()
    request = urllib.request.Request(VERIFY_URL, data=data, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            result = json.loads(response.read().decode())
    except (urllib.error.URLError, TimeoutError, ValueError) as err:
        # Cloudflare unreachable: fail closed so an outage can't disable the guard.
        log.error("Turnstile verification request failed: %s", err)
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Verifikimi anti-spam nuk u krye. Provoni përsëri pas pak."
        )

    if not result.get("success"):
        log.warning("Turnstile rejected a submission: %s", result.get("error-codes"))
        raise bad_captcha
