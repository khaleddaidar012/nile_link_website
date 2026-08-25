import { readFileSync, writeFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const basePath = resolve(__dirname, "..", "messages")

const en = JSON.parse(readFileSync(resolve(basePath, "en.json"), "utf-8"))

const localeConfig = {
  fr: {
    title: "NileLink | Solutions Logistiques Mondiales",
    desc: "NileLink est une societe de transit leader en Egypte, offrant des services de fret maritime, aerien, terrestre, de dedouanement et d'entreposage dans le monde entier.",
  },
  de: {
    title: "NileLink | Globale Logistikloesungen",
    desc: "NileLink ist ein fuehrendes Speditionsunternehmen in Aegypten und bietet See-, Luft- und Landfracht, Zollabfertigung und Lagerhaltung weltweit an.",
  },
  it: {
    title: "NileLink | Soluzioni Logisticche Globali",
    desc: "NileLink e unazienda leader nello spedizioniere in Egitto, offrendo servizi di trasporto marittimo, aereo, terrestre, sdoganamento e magazzinaggio in tutto il mondo.",
  },
  zh: {
    title: "NileLink | Quanqiu Wuliu Jiejue Fangan",
    desc: "NileLink Shi Aiji lingxian de huoyun da\u01d4 gongsi, ti\u01d4gong haiyun, kongyun, luyun, baoguan ji cangchu fuwu.",
  },
  bg: {
    title: "NileLink | Globalni Logistichni Resheniya",
    desc: "NileLink e vodeshta speditorska kompania v Egypt, predlagashta morski, vazdushni i suhoputni prevozi, mitnichesko ochistvane i skladirame po cial svyat.",
  },
}

for (const [locale, cfg] of Object.entries(localeConfig)) {
  const copy = JSON.parse(JSON.stringify(en))
  copy.metadata.title = cfg.title
  copy.metadata.description = cfg.desc
  writeFileSync(resolve(basePath, `${locale}.json`), JSON.stringify(copy, null, 2))
  console.log(`Created ${locale}.json`)
}
