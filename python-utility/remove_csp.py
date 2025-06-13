from mitmproxy import http
import re

TARGET_DOMAINS = [
    "staples.com",
    "www.staples.com"
]

def is_target_domain(hostname: str) -> bool:
    return any(hostname.endswith(domain) for domain in TARGET_DOMAINS)

def response(flow: http.HTTPFlow):
    hostname = flow.request.host

    if not is_target_domain(hostname):
        return

    # Remove CSP from headers
    for header in list(flow.response.headers.keys()):
        if header.lower().startswith("content-security-policy"):
            del flow.response.headers[header]

    # Only process HTML bodies
    content_type = flow.response.headers.get("content-type", "")
    if "text/html" in content_type:
        flow.response.decode()  # decompress if needed
        html = flow.response.text

        # Remove meta CSP tags
        html = re.sub(
            r'<meta[^>]*http-equiv=["\']Content-Security-Policy["\'][^>]*>',
            '',
            html,
            flags=re.IGNORECASE
        )

        flow.response.text = html
