import { mwn } from "mwn";
import { BotConfig } from "../../utils/bot";
import { TIMEOUT } from "../../utils/vars";
import { loadSheetRows } from "../../utils/goog";

const woot = {
    "Шинжлэх ухаан": [
        ["Шинжлэх ухаан", "{{sci-stub}}"],

    ], "Математик": [

        ["Математик", "{{math-stub}}"],
        ["Геометр", "{{Geometry-stub}}"],
        ["Статистик", "{{stat-stub}}"],
        ["Алгебр", "{{algebra-stub}}"],
        ["Криптограф", "{{crypto-stub}}"],
        ["Тоонууд", "{{num-stub}}"],
        ["Комбинаторик", "{{combin-stub}}"],
        ["Хэрэглээний математик", "{{applied-math-stub}}"],
        ["Математик шинжилгээ", "{{mathanalysis-stub}}"],
        ["Алгоритм ба өгөгдлийн бүтэц", "{{algorithm-stub}}"],
        ["Тооны онол", "{{num-theory-stub}}"],
        ["Графикийн онол", "Хуудас үүсгээгүй"],

    ], "Хими": [

        ["Хими", "{{chem-stub}}"],
        ["Химийн элемент", "{{element-stub}}"],
        ["Биохими", "{{biochem-stub}}"],
        ["Химийн нэгдэл", "{{chem-compound-stub}}"],
        ["Физик хими", "{{phys-chem-stub}}"],
        ["Органик хими", "{{organic-chem-stub}}"],
        ["Материал", "{{material-stub}}"],
        ["Органик нэгдэл", "{{organic-compound-stub}}"],
        ["Органик бус хими", "{{inorganic-compound-stub}}"],
        ["Химийн урвал", "{{react-stub}}"],
        ["Аналитик хими", "{{analytic-chem-stub}}"],
        ["Нуклид", "{{isotope-stub}}"],
        ["Тэсрэх бодис", "{{explosive-stub}}"],
        ["Хайлш", "{{alloy-stub}}"],
        ["Нүүрс устөрөгч", "{{hydrocarbon-stub}}"],
        ["Давс", "{{salt-stub}}"],
        ["Хүчил", "{{acid-stub}}"],
        ["Азотын", "{{nitrogen-stub}}"],
        ["Хлорид", "{{chloride-stub}}"],
        ["Бромид", "{{bromide-stub}}"],
        ["Оксид", "{{oxide-stub}}"],
        ["Химийн спирт", "{{alcohol-stub}}"],
        ["Кетон", "{{ketone-stub}}"],
        ["Стероид", "{{steroid-stub}}"],
        ["Органик бус нэгдэл", "{{inorganic-chem-stub}}"],
        ["Тогтмол хүснэгт", "{{periodictable-stub}}"],

    ], "Физик": [

        ["Физик", "{{phys-stub}}"],
        ["Оптик", "{{optic-stub}}"],
        ["Өнгө", "{{color-stub}}"],
        ["Сонгодог механик", "{{classic-mech-stub}}"],
        ["Термодинамик", "{{thermodynamic-stub}}"],
        ["Цахилгаан соронзон", "{{electromagnetic-stub}}"],
        ["Цөмийн физик", "{{nuclear-stub}}"],
        ["Шингэний динамик", "{{fluiddynamic-stub}}"],
        ["Бөөмийн физик", "{{particle-stub}}"],
        ["Квантын физик", "Хуудас үүсгээгүй"],

    ], "Анагаах ухаан": [

        ["Анагаах ухаан", "{{med-stub}}"],
        ["Эм зүй", "{{pharma-stub}}"],
        ["Сэтгэл судлал", "{{psychiatry-stub}}"],
        ["Мэдрэл судлал", "{{neuro-stub}}"],
        ["Мэс засал", "Хуудас үүсгээгүй"],
        ["Шүдний эм", "{{stomatology-stub}}"],
        ["Мал эмнэлгийн эм", "{{veterinary-med-stub}}"],
        ["Эмэгтэйчүүдийн эмнэлэг, эх барих", "Хуудас үүсгээгүй"],
        ["Хор судлал", "{{med-toxic-stub}}"],
        ["Хүүхдийн өвчин", "Хуудас үүсгээгүй"],
        ["Нүдний эмгэг", "{{ophthalmology-stub}}"],
        ["Сексологи", "{{sexology-stub}}"],
        ["Үр хөврөл судлал", "{{embryology-stub}}"],
        ["Паразитологи", "{{parasitology-stub}}"],
        ["Өвчин ба эмгэг", "{{disease-stub}}"],
        ["Мансууруулах бодис", "{{drug-stub}}"],
        ["ATC", "{{ATC-stub}}"],
        ["Шинж тэмдэг, шинж тэмдэг", "{{symptom-stub}}"],
        ["Голомтот халдвар ба цар тахал", "Pages not created"],
        ["Яс-булчингийн тогтолцоо", "{{musculoskeletal-stub}}"],
        ["Хүний тархалт", "{{repro-stub}}"],

    ], "Биологи": [

        ["Биологи", "{{biology-stub}}"],
        ["Анатоми", "{{anat-stub}}"],
        ["Биохими", "{{biochem-stub}}"],
        ["Генетик", "{{gene-stub}}"],
        ["Физиологи", "{{physiology-stub}}"],
        ["Экологи", "{{ecology-stub}}"],
        ["Бодисын солилцоо", "Хуудас үүсгээгүй"],
        ["Амьтны анатоми", "Хуудас үүсгээгүй"],
        ["Микробиологи", "{{microbiology-stub}}"],
        ["Эсийн биологи", "{{cell-biology-stub}}"],
        ["Молекулын биологи", "{{molecular-biology-stub}}"],
        ["Биотехнологи", "{{biotech-stub}}"],
        ["Биофизик", "Хуудас үүсгээгүй"],
        ["Хувьсал", "{{evolution-stub}}"],
        ["Гистологи", "{{histology-stub}}"],
        ["Дархлаа судлал", "Хуудас үүсгээгүй"],
        ["Вирус судлал", "{{virology-stub}}"],
        ["Бактериологи", "{{bacteriology-stub}}"],
        ["Уураг", "{{protein-stub}}"],
        ["Фермент", "{{enzyme-stub}}"],
        ["Мэдрэл судлал", "{{neurosci-stub}}"],
        ["Биоинформатик", "Хуудас үүсгээгүй"],

    ], "Ботаник": [

        ["Ботаник", "{{botany-stub}}"],
        ["Цэцэг", "{{flower-stub}}"],
        ["Жимс", "{{fruit-stub}}"],
        ["Хүнсний ногоо", "{{vegetable-stub}}"],
        ["Мод", "{{tree-stub}}"],
        ["Замаг", "{{alga-stub}}"],
        ["Ойм", "{{pteridophyta-stub}}"],
        ["Өвс", "{{grass-stub}}"],
        ["Кактус", "{{cactus-stub}}"],
        ["Ургамлын гаралтай", "{{herbal-stub}}"],
        ["Asteraceae", "{{asteraceae-stub}}"],
        ["Asterales", "{{asterales-stub}}"],
        ["Ericales", "Хуудас үүсгээгүй"],
        ["Campanulaceae", "{{campanulaceae-stub}}"],
        ["Lamiales", "{{lamiales-stub}}"],
        ["Rosaceae", "Хуудас үүсгээгүй"],
        ["Микологи", "{{mycology-stub}}"],
        ["Хаг", "{{lichen-stub}}"],

    ], "Амьтан судлал": [

        ["Амьтан судлал", "{{zoo-stub}}"],
        ["Амьтад", "{{animal-stub}}"],
        ["Шувуу судлал", "{{Orinitology-stub}}"],
        ["Шавж судлал", "{{entomology-stub}}"],
        ["Ихтиологи", "{{ichthyology-stub}}"],
        ["Герпетологи", "{{herpetology-stub}}"],
        ["Хөхтөн судлал", "{{mammalogy-stub}}"],
        ["Малакологи", "{{malacology-stub}}"],
        ["Артропод", "{{arthropod-stub}}"],
        ["Хоёр нутагтан", "{{amphibian-stub}}"],
        ["Махчин амьтан", "{{carnivora-stub}}"],
        ["Нохой", "{{dog-stub}}"],
        ["Муур", "{{feline-stub}}"],
        ["Морь", "{{horse-stub}}"],
        ["Баавгай", "Хуудас үүсгээгүй"],
        ["Приматологи", "{{primatology-stub}}"],
        ["Мэрэгч", "Хуудас үүсгээгүй"],
        ["Эрвээхэй", "{{lepidoptera-stub}}"],
        ["Ялаа", "{{diptera-stub}}"],
        ["Цох", "{{beetle-stub}}"],
        ["Зөгий", "Хуудас үүсгээгүй"],
        ["Hymenoptera", "Хуудас үүсгээгүй"],
        ["Халим", "{{whale-stub}}"],
        ["Акул", "{{shark-stub}}"],
        ["Рэй сэрвээтэй загас", "Хуудас үүсгээгүй"],
        ["Мэлхий", "{{turtle-stub}}"],
        ["Могой", "{{snake-stub}}"],
        ["Үлэг гүрвэл", "{{dino-stub}}"],
        ["Гүрвэл", "Хуудас үүсгээгүй"],
        ["Мэлхий", "{{frog-stub}}"],
        ["Ходоодны хөл", "{{gastropod-stub}}"],
        ["Мириапод", "Хуудас үүсгээгүй"],
        ["Бат", "{{bat-stub}}"],
        ["Apiodea", "{{apiodea-stub}}"],
        ["Apocrita", "{{apocrita-stub}}"],
        ["Хавч хэлбэрт", "Хуудас үүсгээгүй"],
        ["Арахнид", "{{arachnid-stub}}"],
        ["Аалз", "{{spider-stub}}"],
        ["Papillonidae", "{{papillonidae-stub}}"],
        ["Muscidae", "{{muscidae-stub}}"],
        ["Соно", "Хуудас үүсгээгүй"],
        ["Chrysomelidae", "{{chrysomelidae-stub}}"],
        ["Coccinelidae", "{{coccinelidae-stub}}"],
        ["Вас", "Хуудас үүсгээгүй"],
        ["Hesperiidae", "{{hesperiidae-stub}}"],
        ["Saturnidae", "{{saturnidae-stub}}"],
        ["Zygaenidae", "{{zygaenidae-stub}}"],
        ["Pterophoridae", "Хуудас үүсгээгүй"],
        ["Тоншуул", "{{piciformes-stub}}"],
        ["Тоть", "{{parrot-stub}}"],
        ["Тагтаа", "Хуудас үүсгээгүй"],
        ["Эргийн шувуу", "{{charadriiformes-stub}}"],
        ["Пассерин", "{{passerine-stub}}"],
        ["Perciformes", "{{perciformes-stub}}"],
        ["Siluriformes", "Хуудас үүсгээгүй"],
        ["Hemiptera", "{{hemiptera-stub}}"],
        ["Nematocera", "{{nematocera-stub}}"],

    ], "Одон орон судлал": [

        ["Одон орон судлал", "{{astro-stub}}"],
        ["Ажиглалтын газар", "{{observatory-stub}}"],
        ["Астероид", "{{asteroid-stub}}"],
        ["Астероидын бүс", "Хуудас үүсгээгүй"],
        ["Галакси", "{{galaxy-stub}}"],
        ["Сүүлт од", "{{comet-stub}}"],
        ["Од", "{{star-stub}}"],
        ["Мананцар", "{{nebula-stub}}"],
        ["Од эрхэс", "{{constellation-stub}}"],
        ["Солир", "{{meteor-stub}}"],
        ["Кратер", "{{crater-stub}}"],
        ["Оддын кластер", "{{star-cluster-stub}}"],
        ["Олон одтой", "{{multi-star-stub}}"],
        ["Хувьсах од", "{{var-star-stub}}"],
        ["Аварга од", "{{giant-star-stub}}"],
        ["Бор одой", "Хуудас үүсгээгүй"],
        ["Гараг", "{{planey-stub}}"],
        ["Нарны гаднах гараг", "{{exoplanet-stub}}"],
        ["Лентикуляр галактик", "{{lenticular-galaxy-stub}}"],
        ["Галактик кластер", "{{galaxy-cluster-stub}}"],
        ["Сугар", "Хуудас үүсгээгүй"],
        ["Ангараг", "{{Mars-stub}}"],
        ["Гадаад орон зай", "{{space-stub}}"],
        ["Сар ба нар хиртэлт", "Хуудас үүсгээгүй"],
        ["Сар", "{{moon-stub}}"],
        ["Нар", "{{sun-stub}}"],

    ], "Дэлхийн шинжлэх ухаан": [

        ["Дэлхийн шинжлэх ухаан", "{{geosci-stub}}"],
        ["Геофизик", "{{geophys-stub}}"],
        ["Геодези", "Хуудас үүсгээгүй"],

    ], "Геологи": [

        ["Геологи", "{{geology-stub}}"],
        ["Эрдэс судлал", "{{mineral-stub}}"],
        ["Палеонтологи", "{{paleo-stub}}"],
        ["Галт уул судлал", "{{volcano-stub}}"],
        ["Петрологи", "Хуудас үүсгээгүй"],
        ["Глациологи", "{{glaciology-stub}}"],
        ["Газар хөдлөлт судлал", "{{seismo-stub}}"],
        ["Хөрс судлал", "{{soil-sci-stub}}"],
        ["Тектоник", "Хуудас үүсгээгүй"],
        ["Геологийн тогтоц ба давхарга зүй", "{{geologic-formation-stub}}"],

    ], "Цаг уур": [

        ["Цаг уур", "{{meteo-stub}}"],
        ["Уур амьсгал судлал", "{{climate-stub}}"],
        ["Цаг агаарын өөрчлөлт", "{{climatechange-stub}}"],

    ], "Ус судлал": [

        ["Ус судлал", "{{hydro-stub}}"],
        ["Далай судлал", "{{ocean-stub}}"],
        ["Гидрографи", "Хуудас үүсгээгүй"],

    ], "Компьютерийн шинжлэх ухаан": [

        ["Компьютерийн шинжлэх ухаан", "{{comp-sci-stub}}"],
        ["Програмчлалын хэлүүд", "{{proglang-stub}}"],

    ], "Хэл шинжлэл": [

        ["Хэл шинжлэл", "{{ling-stub}}"],
        ["Дүрэм", "{{grammar-stub}}"],
        ["Фонетик", "{{phonetic-stub}}"],
        ["Фонологи", "{{phonology-stub}}"],
        ["Тайлбар толь ба нэр томъёо", "{{vocab-stub}}"],
        ["Ономастик", "Хуудас үүсгээгүй"],
        ["Филологи", "{{philology-stub}}"],
        ["Риторик", "{{rhetoric-stub}}"],
        ["Семиотик", "{{semiotic-stub}}"],
        ["Орчуулга", "{{translation-stub}}"],
        ["Толь бичиг", "{{dictionary-stub}}"],

    ], "Социологи": [

        ["Социологи", "{{socio-stub}}"],
        ["Хүн ам зүй", "{{demographic-stub}}"],
        ["Нийгмийн сэтгэл зүй", "Хуудас үүсгээгүй"],
        ["Хот төлөвлөлт", "{{planning-stub}}"],

    ], "Сэтгэл судлал": [

        ["Сэтгэл судлал", "{{psych-stub}}"],
        ["Танин мэдэхүйн шинжлэх ухаан", "Хуудас үүсгээгүй"],

    ], "Антропологи": [

        ["Антропологи", "{{anthropo-stub}}"],
        ["Археологи", "{{archaeology-stub}}"],
        ["Угсаатны зүй", "{{ethnology-stub}}"],
        ["Угсаатны зүй", "{{ethnography-stub}}"],

    ], "Хуурамч шинжлэх ухаан": [

        ["Хуурамч шинжлэх ухаан", "{{pseudosci-stub}}"],
        ["Зурхай", "{{astrology-stub}}"],
        ["Криптозоологи", "{{cryptozoo-stub}}"],
        ["Үл мэдэгдэх нисдэг биетүүд", "{{ufology-stub}}"],
        ["Алхими", "{{alchemy-stub}}"],
        ["Гажийн үзэгдэл", "{{paranormal-stub}}"],
        ["Психоанализ", "{{psychoanalysis-stub}}"],
        ["Эзотерицизм", "{{esoteric-stub}}"],

    ], "Теологи": [

        ["Теологи", "{{theology-stub}}"],
        ["Христийн шашны теологи", "{{christ-theology-stub}}"],
        ["Католик шашны теологи", "Хуудас үүсгээгүй"],

    ], "Улс төрийн шинжлэх ухаан": [

        ["Улс төрийн шинжлэх ухаан", "{{polisci-stub}}"],
        ["Олон улсын харилцаа", "{{foreignrelations-stub}}"],
        ["Геополитик", "Хуудас үүсгээгүй"],
        ["Улс төрийн үзэл суртал", "{{poli-ideology-stub}}"],
        ["Коммунизм", "{{communist-stub}}"],
        ["Социализм", "{{socialism-stub}}"],
        ["Анархизм", "Хуудас үүсгээгүй"],
        ["Феминизм", "{{feminist-stub}}"],
        ["Үндэсний үзэл", "{{nationalism-stub}}"],

    ], "Хууль зүй": [

        ["Хууль зүй", "{{law-theory-stub}}"],

    ], "Сурган хүмүүжүүлэх ухаан": [

        ["Сурган хүмүүжүүлэх ухаан", "Хуудас үүсгээгүй"],

    ], "Хүмүүнлэгийн ухаан": [

        ["Хүмүүнлэгийн ухаан", "{{humanities-stub}}"],

    ], "Мэдлэг": [

        ["Мэдлэг", "Хуудас үүсгээгүй"],

    ], "Эдийн засаг, санхүү": [

        ["Эдийн засаг", "{{econ-stub}}"],
        ["Санхүү", "{{finance-stub}}"],
        ["Худалдаа", "{{trade-stub}}"],
        ["Нягтлан бодох бүртгэл", "{{accounting-stub}}"],
        ["Маркетинг", "{{marketing-stub}}"],
        ["Зар сурталчилгаа", "Хуудас үүсгээгүй"],
        ["Эдийн засгийн түүх", "{{econ-hist-stub}}"],
        ["Хөрөнгийн бирж", "{{stockexchange-stub}}"],

    ], "Нумизматик": [

        ["Нумизматик", "{{numismatics-stub}}"],
        ["Зоос", "{{coin-stub}}"],
        ["Мөнгө", "{{money-stub}}"],
        ["Валют", "{{currency-stub}}"],
        ["Криптовалют", "{{cryptocurrency-stub}}"],

    ], "Философи": [

        ["Философи", "{{philo-stub}}"],
        ["Логик", "{{logic-stub}}"],
        ["Ёс зүй", "{{ethic-stub}}"],
        ["Нийгмийн философи", "Хуудас үүсгээгүй"],
        ["Гоо зүй", "{{aesthetics-stub}}"],

    ], "Түүх": [

        ["Түүх", "{{hist-stub}}"],
        ["Шинжлэх ухааны түүх", "{{sci-hist-stub}}"],
        ["Урлагийн түүх", "{{art-hist-stub}}"],
        ["Гамшгийн менежмент", "{{disaster-stub}}"],
        ["Газар хөдлөлт", "{{earthquake-stub}}"],
        ["Улс төрийн түүх", "Хуудас үүсгээгүй"],
        ["Цэргийн түүх", "{{mil-hist-stub}}"],
        ["Эртний түүх", "{{ancient-hist-stub}}"],
        ["Домог зүй", "{{myth-stub}}"],
        ["Хувьсгал", "{{revolt-stub}}"],
        ["Эсэргүүцэл", "Хуудас үүсгээгүй"],
        ["Зөрчилдөөн", "{{conflict-stub}}"],
        ["Дайнууд", "{{war-stub}}"],
        ["Тулаан", "{{battle-stub}}"],
        ["Маргаантай газар нутаг", "{{dispute-territory-stub}}"],
        ["Түүх бичиг", "Хуудас үүсгээгүй"],
        ["Бүс нутгийн түүх", "{{region-hist-stub}}"],
        ["Үйл явдал", "{{event-stub}}"],
        ["Орчин үеийн түүх", "{{modern-hist-stub}}"],
        ["Боолчлол", "{{slavery-stub}}"],
        ["Архив", "Хуудас үүсгээгүй"],
        ["Он цагийн хэлхээс", "{{chrono-stub}}"],
        ["Он жилүүд", "{{year-stub}}"],
        ["Сонгодог Эртний Грек, Ром сонгодог", "{{classic-stub}}"],
        ["Халуун орны циклонууд", "{{tropical-cyclone-stub}}"],
        ["Хайгуул", "Хуудас үүсгээгүй"],
        ["Устсан хэл", "{{extinct-lang-stub}}"],
        ["Арван жил", "{{decade-stub}}"],
        ["Олон зуун", "{{century-stub}}"],
        ["Мянган жил", "{{millennia-stub}}"],
        ["Түүхийн өмнөх үе", "{{prehist-stub}}"],

    ], "Газарзүй": [

        ["Газарзүй", "{{geo-stub}}"],
        ["Хүн амын суурьшил", "{{popplace-stub}}"],
        ["Хотууд", "{{city-stub}}"],
        ["Улс орнууд", "{{country-stub}}"],
        ["Гол мөрөн", "{{river-stub}}"],
        ["Нуурууд", "{{lake-stub}}"],
        ["Паркууд", "Хуудас үүсгээгүй"],
        ["Уул", "{{mountain-stub}}"],
        ["Арлууд", "{{island-stub}}"],
        ["Тэнгисүүд", "{{sea-stub}}"],
        ["Хүрхрээ", "{{waterfall-stub}}"],
        ["Тусгай хамгаалалттай газар нутаг", "{{protected-area-stub}}"],
        ["Мөсөн гол", "Хуудас үүсгээгүй"],
        ["Амттан", "{{desert-stub}}"],
        ["Далайн эргүүд", "{{beach-stub}}"],
        ["Хоолой", "{{strait-stub}}"],
        ["Хөндий", "{{valley-stub}}"],
        ["Суваг", "{{canal-stub}}"],
        ["Фьорд", "Хуудас үүсгээгүй"],
        ["Хойгууд", "{{peninsula-stub}}"],
        ["Бэйс", "{{bay-stub}}"],
        ["Персийн булан", "{{gulf-stub}}"],
        ["Эрэгүүд", "{{coast-stub}}"],
        ["Газарзүйн нэр томъёо", "{{geo-term-stub}}"],
        ["Cape", "Хуудас үүсгээгүй"],
        ["Далайн газарзүй", "{{marine-geo-stub}}"],
        ["Физик газарзүй", "{{phys-geo-stub}}"],
        ["Усанд орох", "Хуудас үүсгээгүй"],

    ], "Инженерийн": [

        ["Инженерийн", "{{eng-stub}}"],
        ["Цахилгаан техник", "{{electric-eng-stub}}"],
        ["Механик инженер", "{{mech-eng-stub}}"],
        ["Дууны технологи", "{{sound-stub}}"],
        ["Барилгын инженерчлэл", "{{civil-eng-stub}}"],
        ["Цаг уур", "{{metrology-stub}}"],
        ["Металлурги", "{{metallurgy-stub}}"],
        ["Хөдөлгүүр", "{{engine-stub}}"],
        ["Робот техник", "{{robotic-stub}}"],
        ["Уул уурхай", "{{mining-stub}}"],
        ["Барилга", "Хуудас үүсгээгүй"],
        ["Ойн аж ахуй", "{{forestry-stub}}"],
        ["Сансрын нисгэгч", "{{astronautics-stub}}"],
        ["Машин", "{{machine-stub}}"],
        ["Нанотехнологи", "Хуудас үүсгээгүй"],
    ]
}

const main = async () => {
    // const bot = new mwn(BotConfig);
    // await bot.login();


    const SHEETNAME = "Stubs";

    const allRowDatas = await loadSheetRows(SHEETNAME);

    for await (const allRowData of allRowDatas) {
        const row = allRowData?.goog;
        if (!row) {
            console.log("Unknown error");
            continue;
        }

        const name = (row["name"] as string).replace("Загвар:", "").toLowerCase()
        let category = "";
        Object.keys(woot).forEach(key => {
            // if ((woot as any)[key][1] === name) {
            //     category = key
            //     console.log(category)
            // }

            console.log((woot as any)[key])

            const matching = (woot as any)[key]


        });

        // row["typenew"] = mat;
        // await row.save();

        // await new Promise((r) => setTimeout(r, TIMEOUT));
    }
};

main();
