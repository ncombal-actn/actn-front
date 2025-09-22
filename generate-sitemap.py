import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from urllib.parse import urljoin, urlparse, unquote, parse_qs
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

# 🌐 URL de base de ton site
base_url = 'https://www.actn.fr'

# 🚫 Patterns à exclure pour éviter les liens qui déclenchent des mails ou autres actions
EXCLUDE_PATTERNS = [
    "mailto:",
    "contact",
    "sendMail",
    "email",
    "newsletter",
]

visited = set()

def is_valid_link(href):
    """Vérifie que l'URL est valide et ne contient pas de pattern exclu."""
    if not href:
        return False
    if any(pattern in href for pattern in EXCLUDE_PATTERNS):
        return False
    parsed = urlparse(href)
    queries = parse_qs(parsed.query)
    if 'notify' in queries or 'send' in parsed.path or 'mail' in parsed.path:
        return False
    return parsed.netloc == "" or parsed.netloc == urlparse(base_url).netloc

def scroll_page(driver):
    """Effectue un scroll pour charger le contenu en scroll infini 🚀."""
    last_height = driver.execute_script("return document.body.scrollHeight")
    scroll_tries = 0
    while scroll_tries < 5:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        print("⏳ Scrolling...")
        time.sleep(2)  # attend que le contenu se charge
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            scroll_tries += 1
        else:
            scroll_tries = 0
            last_height = new_height

def create_sitemap():
    chrome_options = Options()
    chrome_options.add_argument('--headless=new')  # Mode headless pour la rapidité 🔒
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--log-level=3')
    driver = webdriver.Chrome(options=chrome_options)

    to_visit = [base_url]
    root = Element('urlset', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    while to_visit:
        current_url = to_visit.pop(0)
        if current_url in visited:
            continue

        print(f"🔍 Visiting: {current_url}")
        try:
            driver.get(current_url)
            time.sleep(2)
            # Si la page semble utiliser du scroll infini (ex: catalogue), on scrolle !
            if '/catalogue' in current_url or '/produits' in current_url:
                scroll_page(driver)
        except Exception as e:
            print(f"❌ Erreur en visitant {current_url}: {e}")
            continue

        visited.add(current_url)

        # Ajoute l'URL au sitemap
        url_elem = SubElement(root, 'url')
        SubElement(url_elem, 'loc').text = current_url
        print(f"✅ URL ajoutée: {current_url}")

        # Récupération et traitement des liens
        try:
            links = driver.find_elements(By.CSS_SELECTOR, "a[href]")
            print(f"📑 {len(links)} liens trouvés sur {current_url}")
            for link in links:
                href = link.get_attribute('href')
                if is_valid_link(href):
                    full_url = urljoin(current_url, href)
                    # Décoder les caractères encodés (%2F, etc.) 🔓
                    full_url = unquote(full_url)
                    # Si on a une double barre oblique après le domaine, on corrige (ex: //catalogue)
                    if full_url.startswith(base_url + "//"):
                        full_url = base_url + full_url[len(base_url) + 1:]
                    if full_url.startswith(base_url) and full_url not in visited and full_url not in to_visit:
                        to_visit.append(full_url)
                        print(f"➡️ Ajout du lien: {full_url}")
        except Exception as e:
            print(f"❌ Erreur lors de l'extraction des liens sur {current_url}: {e}")

    driver.quit()

    # Génération du XML formaté
    pretty_xml = minidom.parseString(tostring(root)).toprettyxml(indent="  ")
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(pretty_xml)
    print("🎉 Sitemap généré avec succès dans 'sitemap.xml'!")

if __name__ == "__main__":
    create_sitemap()
