# Életmódváltás Pro

Mobilra, elsődlegesen iPhone-ra optimalizált, telepíthető webalkalmazás. Az eredeti koncepció megmaradt: személyre szabott edzésterv, étkezési terv és automatikus bevásárlólista.

Az edzésmotor 10 nehézségi szintet kezel. A szint nemcsak a sorozatszámot, hanem a konkrét gyakorlatvariációt is módosítja, és minden gyakorlat külön könnyíthető vagy nehezíthető. A táplálkozási célok: szálkásítás, szálkás izomépítés/rekompozíció, tiszta tömegelés, bulk és karbantartás; a kilogramm- és időcélok opcionálisak.

## Indítás

Nyisd meg az `index.html` fájlt, vagy töltsd fel a mappa teljes tartalmát egy HTTPS-t használó statikus tárhelyre (például GitHub Pagesre). iPhone-on Safariban a **Megosztás → Főképernyőhöz adás** paranccsal telepíthető.

## Fontos fájlok

- `index.html` – az alkalmazás és minden üzleti logika
- `exercise-atlas.webp`, `strength-atlas.webp`, `skill-atlas.webp` – generált sport-, erőgyakorlat- és technikai skill-illusztrációk
- `icon-180.png`, `icon-512.png` – iPhone/PWA ikonok
- `manifest.webmanifest`, `sw.js` – telepíthetőség és offline gyorsítótár

Az alkalmazás az adatokat az adott böngésző helyi tárhelyén tárolja. A kalória- és makróértékek becslések, nem orvosi diagnózisok; tartós betegség, sérülés vagy speciális étrendi igény esetén szakember bevonása javasolt.
