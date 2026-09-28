from slowapi import Limiter
from slowapi.util import get_remote_address

# Per-client rate limiter. Endpoints opt in with @limiter.limit(...).
#
# Keyed on the remote address. When the API is hit directly (the realistic
# brute-force / spam vector, since the Railway URL is public), that's the
# attacker's own IP. Requests coming through the Next.js server share its
# egress IP, so those are limited as a group - acceptable, since legitimate
# form volume is low and scripted abuse targets the API directly.
limiter = Limiter(key_func=get_remote_address)
