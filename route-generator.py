from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from urllib.parse import urljoin, urlparse
import time
import requests

# Configuration pour exécuter Chrome sans interface graphique (headless mode)
chrome_options = Options()
chrome_options.add_argument("--headless")

# Utilisation de WebDriver Manager pour télécharger et utiliser le bon ChromeDriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

# URL de connexion et URL de départ
login_url = "https://www.actn.fr/actn/login"  # Change l'URL selon le site
base_url = "https://www.actn.fr/"

# Informations de connexion
username = "111"
password = "aa"

# Fonction pour se connecter
def login(driver):
    driver.get(login_url)
    time.sleep(2)  # Attendre que la page se charge

    try:
        # Remplir le formulaire de connexion
        username_field = driver.find_element(By.CSS_SELECTOR, "input[id='mat-input-2']")  # Change le sélecteur selon le site
        password_field = driver.find_element(By.CSS_SELECTOR, "input[id='mat-input-3']")  # Change le sélecteur selon le site
        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")  # Change le sélecteur selon le site

        username_field.send_keys(username)
        password_field.send_keys(password)
        login_button.click()

        # Attendre que la connexion soit terminée (ajuster le délai si nécessaire)
        time.sleep(5)
        print("Connexion réussie")
    except Exception as e:
        print(f"Erreur lors de la connexion : {str(e)}")
        driver.quit()
        exit(1)

# Fonction pour vérifier le code de statut HTTP avant de charger une page
def check_http_status(url):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            print(f"[200 OK] : {url}")
            return True
        else:
            print(f"[{response.status_code} ERROR] : {url}")
            return False
    except requests.RequestException as e:
        print(f"[ERROR] Problème avec {url} : {str(e)}")
        return False

# Fonction pour récupérer tous les liens internes de la page rendue par le navigateur
def extract_internal_links(driver, url, base_domain):
    try:
        driver.get(url)  # Charger la page avec Selenium
        time.sleep(3)  # Attendre que le JavaScript se charge

        links = set()
        elements = driver.find_elements(By.TAG_NAME, "a")

        for elem in elements:
            href = elem.get_attribute("href")
            if href and (href.startswith('/') or base_domain in href):
                full_url = urljoin(base_url, href)
                links.add(full_url)

        return links
    except Exception as e:
        print(f"Erreur lors du chargement de la page {url}: {str(e)}")
        return set()  # Retourne un ensemble vide en cas d'erreur

# Fonction principale pour explorer toutes les routes d'un site Angular avec SSR
def crawl_site(driver, start_url):
    base_domain = urlparse(start_url).netloc
    visited_urls = set()
    urls_to_visit = {start_url}

    while urls_to_visit:
        current_url = urls_to_visit.pop()
        if current_url not in visited_urls:
            if check_http_status(current_url):
                print(f"Exploration de {current_url}")
                visited_urls.add(current_url)

                # Réessayer jusqu'à 3 fois en cas d'erreur de chargement
                for _ in range(3):
                    new_links = extract_internal_links(driver, current_url, base_domain)
                    if new_links:
                        break  # Si des liens sont trouvés, on arrête les tentatives

                # Ajoute les nouveaux liens non visités
                urls_to_visit.update(new_links - visited_urls)

                # Pause pour éviter de surcharger le serveur
                time.sleep(2)
            else:
                print(f"Skipping {current_url} (HTTP error)")

    return visited_urls

# Se connecter
login(driver)

# Lancer le crawler
all_routes = crawl_site(driver, base_url)

# Enregistre toutes les routes dans un fichier .txt
with open('routes_trouvees_selenium.txt', 'w') as f:
    for route in sorted(all_routes):
        f.write(route + '\n')

print("Routes enregistrées dans le fichier 'routes_trouvees_selenium.txt'.")

# Fermer le navigateur
driver.quit()
