# Életmódváltás Pro

Mobilra, elsődlegesen iPhone-ra optimalizált, telepíthető webalkalmazás. Az eredeti koncepció megmaradt: személyre szabott edzésterv, étkezési terv és automatikus bevásárlólista.

Az edzésmotor 10 nehézségi szintet kezel. A szint nemcsak a sorozatszámot, hanem a konkrét gyakorlatvariációt is módosítja, és minden gyakorlat külön könnyíthető vagy nehezíthető. A táplálkozási célok: szálkásítás, szálkás izomépítés/rekompozíció, tiszta tömegelés, bulk és karbantartás; a kilogramm- és időcélok opcionálisak.

## Indítás

Nyisd meg az `index.html` fájlt, vagy töltsd fel a mappa teljes tartalmát egy HTTPS-t használó statikus tárhelyre (például GitHub Pagesre). iPhone-on Safariban a **Megosztás → Főképernyőhöz adás** paranccsal telepíthető.

## Frissítés és verziókezelés (FONTOS)

A telepített PWA mostantól megbízhatóan frissül:

- **Online mindig a legfrissebb tartalom tölt be** – a service worker az `index.html`-t és a `version.json`-t egyedi, gyorsítótár-kerülő URL-lel kéri le (nem a megbízhatatlan `{cache:"no-store"}` opcióra hagyatkozik), a képek/atlaszok pedig „stale-while-revalidate" módon frissülnek a háttérben. Offline a legutóbb elmentett verzió megy.
- **Beállítások → Alkalmazás**: a „Frissítés keresése / telepítés" gomb valósan érzékeli az új buildet (a `version.json`-t mindig hálózatról olvassa). Ha van új verzió, egy koppintással telepíthető.
- **„🧹 Gyorsítótár ürítése és újratöltés"**: ha bármiért mégis a régit látnád, ez a gomb garantáltan a legfrissebbet tölti be – **nem kell törölni és újra a főképernyőhöz adni.**
- A futó verzió mindig látszik: a fejlécben a `v…` chip, a Beállításokban a teljes verzió + build dátum.

**Deploykor egyetlen dolgod van:** növeld a verziószámot **három helyen, ugyanarra az értékre** (pl. `2026.07.20.2`):
1. `index.html` → `var APP_VERSION="…"` (és `APP_BUILD_DATE`)
2. `sw.js` → `const VERSION="…"`
3. `version.json` → `"version": "…"` (és `"cache"`)

Ha ezt megteszed, a telefon a következő megnyitáskor automatikusan az újat kapja, és a „Frissítés elérhető" jelzés is pontos lesz. (Ha véletlenül elfelejtenéd bumpolni, a tartalom akkor is frissül online – csak a „van új verzió" jelzés nem jelenik meg.)

## Fontos fájlok

- `index.html` – az alkalmazás és minden üzleti logika
- `exercise-atlas.webp`, `strength-atlas.webp`, `skill-atlas.webp` – generált sport-, erőgyakorlat- és technikai skill-illusztrációk
- `icon-180.png`, `icon-512.png` – iPhone/PWA ikonok
- `manifest.webmanifest`, `sw.js` – telepíthetőség és offline gyorsítótár

Az alkalmazás az adatokat az adott böngésző helyi tárhelyén tárolja. A kalória- és makróértékek becslések, nem orvosi diagnózisok; tartós betegség, sérülés vagy speciális étrendi igény esetén szakember bevonása javasolt.
