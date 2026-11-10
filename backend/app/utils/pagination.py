def paginate(rows: list, page: int, page_size: int):
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)
    start = (page - 1) * page_size
    return rows[start : start + page_size], {"page": page, "page_size": page_size, "total": len(rows)}
