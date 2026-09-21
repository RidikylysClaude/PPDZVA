"""Собирает mailing/ppdzva-catalog.html из реальных страниц сайта (тексты/иконки не перепечатываются вручную)."""
import re, html, pathlib

ROOT = pathlib.Path(r"C:\Users\Administrator\myProgect\PPDZVA")
OUT = ROOT / "mailing" / "ppdzva-catalog.html"


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def cards(section_html):
    out = []
    for m in re.finditer(r'<div class="advantage-card">(.*?)</div>\s*(?=<div class="advantage-card">|</div>\s*</div>\s*</section>)', section_html, re.S):
        c = m.group(1)
        svg = re.search(r"<svg.*?</svg>", c, re.S).group(0)
        title = re.search(r'advantage-card__title">(.*?)</h3>', c, re.S).group(1)
        text = re.search(r'advantage-card__text">(.*?)</p>', c, re.S).group(1)
        out.append((svg, norm(title), norm(text).replace(" (см. скриншоты ниже)", "").replace(" — без перепрошивки и завода на завод", "")))
    return out


def adv_section(s, cls="advantages"):
    a = s.index(f'<section class="{cls}"')
    b = s.index("</section>", a)
    return s[a:b + 10]


PRODUCTS = [
    ("bpvv", "bpvv/bpvv1.jpg", "Блок питания"),
    ("buvv", "buvv/buvv1.jpg", "Блок управления"),
    ("rs80", "rs80/rs80-1.jpg", "Реле максимального тока"),
    ("eis-ln-220-kb", None, "Ретрофит-модуль для табло ТСБ"),
]

PRICES = {"bpvv": "35 000", "buvv": "35 000", "rs80": "50 000", "eis-ln-220-kb": "5 000"}
FIT = set()
data = []
for slug, photo, kind in PRODUCTS:
    s = (ROOT / "products" / f"{slug}.html").read_text(encoding="utf8")
    hero = s[s.index('<section class="product-hero">'):s.index('<section class="advantages"')]
    h1 = re.search(r'<h1 class="product-hero__title[^"]*">(.*?)</h1>', hero, re.S).group(1)
    code = re.search(r'<span class="product-hero__code">(.*?)</span>', h1, re.S)
    name = norm(re.sub(r"<span.*?</span>", "", h1, flags=re.S))
    badge = re.search(r'<span class="(badge[^"]*)">(.*?)</span>', hero, re.S)
    rep = re.search(r'product-hero__replaces-text">(.*?)</p>', hero, re.S)
    descs = re.findall(r'<p class="product-hero__desc[^"]*">(.*?)</p>', hero, re.S)
    data.append(dict(
        slug=slug, photo=photo, price=PRICES[slug], kind=kind, name=name,
        code=norm(code.group(1)) if code else "",
        badge_cls=badge.group(1) if badge else "", badge=norm(badge.group(2)) if badge else "",
        rep=norm(rep.group(1)) if rep else "",
        desc=[norm(d) for d in descs],
        adv=cards(adv_section(s)),
    ))

idx = (ROOT / "index.html").read_text(encoding="utf8")
why = cards(adv_section(idx))
about = re.search(r'<section[^>]*id="about".*?</section>', idx, re.S).group(0)
about_lead = norm(re.search(r'about__lead[^>]*>(.*?)</p>', about, re.S).group(1)) if 'about__lead' in about else None
print("why:", len(why), [w[1] for w in why])
for d in data:
    print(d["slug"], len(d["adv"]), d["badge"], "|", d["rep"][:40], "|", [x[:30] for x in d["desc"]])
    assert len(d["adv"]) == 6, d["slug"]
assert len(why) == 6

CSS = (pathlib.Path(__file__).parent / "catalog.css").read_text(encoding="utf8")
ICON_ARROW = ""


def eis_visual():
    return """
<div class="visual visual--eis">
  <p class="visual__eyebrow">Принцип работы</p>
  <svg viewBox="0 0 300 220" class="eis-chart" role="img" aria-label="Ток модуля: бросок до 220 мА в первую секунду, спад до 2–5 мА">
    <line x1="34" y1="18" x2="34" y2="176" stroke="#9aa0a8" stroke-width="1.2"/>
    <line x1="34" y1="176" x2="288" y2="176" stroke="#9aa0a8" stroke-width="1.2"/>
    <path d="M34 176 L34 40 C 70 40, 84 44, 100 96 C 114 140, 130 166, 180 172 C 220 175, 260 175, 288 175" fill="none" stroke="#ffb020" stroke-width="3" stroke-linecap="round"/>
    <path d="M34 40 L288 40" stroke="#383f46" stroke-width="1" stroke-dasharray="3 4"/>
    <circle cx="34" cy="40" r="4" fill="#ffb020"/>
    <text x="44" y="32" class="c-lab c-lab--amber">до 220 мА</text>
    <text x="198" y="164" class="c-lab">2–5 мА</text>
    <text x="34" y="196" class="c-lab c-lab--dim">0</text>
    <text x="96" y="196" class="c-lab c-lab--dim">≈ 1 с — плавный спад</text>
    <text x="288" y="196" class="c-lab c-lab--dim" text-anchor="end">время</text>
  </svg>
  <p class="visual__cap">Клемма XS1 повторяет ток нити накала лампы после включения — импульсные реле (РТД) и приборы контроля цепей сигнализации работают штатно.</p>
  <div class="visual__colors">
    <span><i class="dot dot--red"></i>К — красное</span>
    <span><i class="dot dot--warm"></i>Б — белое тёплое</span>
  </div>
</div>"""


def product_page(d, n):
    if d["photo"]:
        src = f'../img/products/{d["photo"]}'
        if d["slug"] in FIT:
            visual = f'<div class="visual visual--photo visual--fit"><i style="background-image:url({src})"></i><img src="{src}" alt="{d["name"]} {d["code"]}"></div>'
        else:
            visual = f'<div class="visual visual--photo"><img src="{src}" alt="{d["name"]} {d["code"]}"></div>'
    else:
        visual = eis_visual()
    cards_html = "".join(
        f'<div class="acard"><div class="acard__icon">{svg}</div><h3>{t}</h3><p>{x}</p></div>'
        for svg, t, x in d["adv"]
    )
    code = f'<span class="code">{d["code"]}</span>' if d["code"] else ""
    badge = f'<span class="{d["badge_cls"]}">{d["badge"]}</span>' if d["badge"] else ""
    rep = f'<p class="rep">{d["rep"]}</p>' if d["rep"] else ""
    desc = "".join(f"<p>{p}</p>" for p in d["desc"][:1])
    return f"""
<section class="page page--product">
  {topbar(n)}
  <div class="product">
    <div class="product__visual">{visual}</div>
    <div class="product__info">
      <p class="eyebrow"><i></i>{d["kind"]}</p>
      <h1>{d["name"]} {code}</h1>
      <div class="replaces">{badge}{rep}</div>
      <div class="desc">{desc}</div>
      <div class="price"><span>Цена</span><b>{d["price"]} ₽</b><em>с НДС</em></div>
    </div>
  </div>
  <div class="adv">
    <p class="eyebrow"><i></i>Преимущества</p>
    <h2>Почему {d["name"]}</h2>
    <div class="adv__grid">{cards_html}</div>
  </div>
  {contact_strip()}
</section>"""


def topbar(n):
    return f"""<header class="topbar">
    <img src="../img/icons/logo-dzva.webp" alt="ПП ДЗВА">
    <span class="topbar__name">Производственное Предприятие ДЗВА</span>
    <span class="topbar__page">{n:02d}</span>
  </header>"""


def contact_strip():
    return """<footer class="strip">
    <div class="strip__lead">Заказ и наличие</div>
    <a href="tel:+79119688528">+7 (911) 968-85-28</a>
    <a href="mailto:manager@ppdzva.ru">manager@ppdzva.ru</a>
    <a href="https://ppdzva.ru">ppdzva.ru</a>
  </footer>"""


def overview_rows():
    rows = ""
    for d in data:
        rep = d["badge"] or ""
        code = f'<span class="code">{d["code"]}</span>' if d["code"] else ""
        rows += f'<li><b>{d["name"]} {code}</b><span>{d["kind"]}</span><em class="{d["badge_cls"]}">{rep}</em><strong>{d["price"]}&nbsp;₽</strong></li>'
    return rows


why_html = "".join(
    f'<div class="acard acard--sm"><div class="acard__icon">{svg}</div><h3>{t}</h3><p>{x}</p></div>' for svg, t, x in why
)

cover = f"""
<section class="page page--cover">
  <div class="hero">
    <img class="hero__logo" src="../img/icons/logo-dzva.webp" alt="ПП ДЗВА">
    <p class="hero__company">Производственное Предприятие&nbsp;ДЗВА</p>
    <h1 class="hero__title">Блоки управления, питания и защиты для энергетики</h1>
    <p class="hero__lead">Российское производство pin-to-pin аналогов снятого с производства оборудования: замена без изменения проектной документации.</p>
  </div>
  <div class="about">
    <div class="about__text">
      <p class="eyebrow"><i></i>О компании</p>
      <p>От экспертов отрасли — для вашей инфраструктуры. 15 лет реализуем сложные энергетические проекты. Накопленный опыт и дефицит качественных решений на рынке побудили нас создать собственную производственную базу: сегодня мы выпускаем блоки защиты и управления, готовые к бесперебойной работе в любых условиях.</p>
    </div>
    <ul class="facts">
      <li><b>2014</b>занимаемся энергетическими проектами</li>
      <li><b>RU</b>производство и сертификация полностью в России</li>
      
    </ul>
  </div>
  <div class="whyus">
    <p class="eyebrow"><i></i>Почему выбирают ПП ДЗВА</p>
    <div class="adv__grid adv__grid--3">{why_html}</div>
  </div>
  <div class="overview">
    <p class="eyebrow"><i></i>В этом каталоге</p>
    <ul class="overview__list">{overview_rows()}</ul>
  </div>
  {contact_strip()}
</section>"""

pages = cover + "".join(product_page(d, i + 2) for i, d in enumerate(data))

doc = f"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>ПП ДЗВА — каталог продукции</title>
<link rel="stylesheet" href="../css/fonts.css">
<link rel="stylesheet" href="../css/tokens.css">
<style>{CSS}</style>
</head>
<body>{pages}
</body>
</html>"""
OUT.write_text(doc, encoding="utf8")
print("written", OUT, len(doc))
