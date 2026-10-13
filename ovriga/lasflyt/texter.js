/* Läsflyt och Bokstäver: nivåer, helord, texter och bokstävernas nyckelord. Delas av ovriga/lasflyt/ och ovriga/bokstaver/.
   Nivåerna är samma trappa i båda övningarna. Bokstäverna läggs till nivå för nivå (ordningen inom en nivå spelar ingen roll).
   En text får bara innehålla nivåns bokstäver och tidigare nivåers, plus helord (HELORD) som gås igenom före läsningen.
   Svarsalternativen följer samma regel; frågan läser den vuxne upp, så den är undantagen. Kontrolleras av ett testskript. */
window.LASNIVA=[
  {n:1,nya:"SOLARMEVIN",namn:"S O L A R M E V I N"},
  {n:2,nya:"TDUK",namn:"T D U K"},
  {n:3,nya:"GBPH",namn:"G B P H"},
  {n:4,nya:"ÅÄÖ",namn:"Å Ä Ö"},
  {n:5,nya:"FJYCXZWQ",namn:"F J Y C X Z W Q"}];
// alla bokstäver som gäller på en nivå (nivåns och alla tidigare)
window.lasBokst=n=>LASNIVA.filter(x=>x.n<=n).map(x=>x.nya).join("");
// vanliga ord som lärs in före läsningen (de första orden i Högfrekventa ord)
window.HELORD=["och","är","jag","det","ett","inte","har"];
window.LASTEXTER=[
// ---------- Nivå 1: S O L A R M E V I N ----------
{id:"1-01",niva:1,text:"Mia ser en sol. Solen är varm. Mia ler.",fraga:"Hur är solen?",svar:["varm","sval","lila"]},
{id:"1-02",niva:1,text:"Ola ser en orm. Ormen vilar i solen. Ola sa: Ormen sover!",fraga:"Vad gör ormen?",svar:["sover","simmar","ramlar"]},
{id:"1-03",niva:1,text:"En ren vilar. Renen nosar i mossa. Lars och Mia ser renen.",fraga:"Var nosar renen?",svar:["i mossa","i ris","i lera"]},
{id:"1-04",niva:1,text:"Elin simmar som en sill. Mormor ser Elin. Mormor ler.",fraga:"Hur simmar Elin?",svar:["som en sill","som en ren","som en orm"]},
{id:"1-05",niva:1,text:"Nils har en melon. Nils mosar melonen. Mamma ler. Mm, mos!",fraga:"Vad mosar Nils?",svar:["en melon","en ros","en sill"]},
{id:"1-06",niva:1,text:"Ola simmar. Vera simmar. Vem vinner? Alla vinner!",fraga:"Vem vinner?",svar:["alla","Ola","Vera"]},
{id:"1-07",niva:1,text:"Sam ror. Sam ser en val. Valen är enorm. Valen simmar ner.",fraga:"Hur är valen?",svar:["enorm","smal","lila"]},
{id:"1-08",niva:1,text:"Ville har en sill i en vas. Sillen simmar. Ville sa: Min sill!",fraga:"Var simmar sillen?",svar:["i en vas","i ris","i mossa"]},
{id:"1-09",niva:1,text:"Lina vill inte sova. Mamma sa: Sov, Lina! Lina sover.",fraga:"Vem sa: Sov?",svar:["Mamma","Mormor","Ola"]},
{id:"1-10",niva:1,text:"Elin ser lamm i solen. Lammen vilar. Elin vilar som lammen.",fraga:"Vad gör lammen?",svar:["vilar","simmar","morrar"]},
{id:"1-11",niva:1,text:"Nils ramlar i lera. Mamma ser Nils. Mamma sa: Nils, Nils! Nils ler.",fraga:"Vad ramlar Nils i?",svar:["i lera","i mossa","i ris"]},
{id:"1-12",niva:1,text:"Isa mimar en orm. Ola mimar en ren. Vem mimar en sol? Jag!",fraga:"Vad mimar Isa?",svar:["en orm","en ren","en sol"]},
{id:"1-13",niva:1,text:"Mormor ror i solen. Elin simmar. Mormor ser Elin och ler.",fraga:"Vem ror?",svar:["Mormor","Elin","Vera"]},
{id:"1-14",niva:1,text:"Alva ser en vas. I vasen är en ros. Alva visar mormor. Mormor ler.",fraga:"Vad är i vasen?",svar:["en ros","en sill","en orm"]},
// ---------- Nivå 2: + T D U K ----------
{id:"2-01",niva:2,text:"Det är en katt. Katten ser en mus. Musen rusar in i en sko. Katten tittar in i skon. Tom!",fraga:"Var rusar musen in?",svar:["i en sko","i en vas","i en kudde"]},
{id:"2-02",niva:2,text:"Tuva och Ola lade en kaka. Kakan är stor och rund. Tuva tar en del. Ola tar en del. Mums!",fraga:"Hur är kakan?",svar:["stor och rund","liten och sur","smal och kall"]},
{id:"2-03",niva:2,text:"En duva sitter i en ek. Duvan ser Ali. Ali kastar smulor till duvan. Duvan tar smulor. Ali ler.",fraga:"Vad kastar Ali?",svar:["smulor","stenar","kottar"]},
{id:"2-04",niva:2,text:"Det är natt. Linus vill inte sova. Mamma sa: Sov nu! Linus sov till sist.",fraga:"Vad sa mamma?",svar:["Sov nu!","Kom ut!","Simma nu!"]},
{id:"2-05",niva:2,text:"Det är en ko. Kon vilar vid ett staket. En kalv kommer. Kalven diar. Kon muar: Mu!",fraga:"Vem kommer till kon?",svar:["en kalv","en katt","en duva"]},
{id:"2-06",niva:2,text:"Ida och Viktor sitter i en kanot. De ror ut. Det stormar. Vatten skvalar in. De ror in mot land.",fraga:"Vad gör de när det stormar?",svar:["ror in mot land","simmar ut","sover"]},
{id:"2-07",niva:2,text:"Mamma och Kim ska ta tomater. Kim tar en stor tomat. Kim smakar. Mm, den är sur!",fraga:"Hur smakar tomaten?",svar:["sur","salt","mild"]},
{id:"2-08",niva:2,text:"Nu kommer Tusse. Tusse är en kanin. Tusse tar en morot. Mums, mums! Nu är moroten slut. Tusse vill ta en till.",fraga:"Vad tar Tusse?",svar:["en morot","en tomat","en kaka"]},
{id:"2-09",niva:2,text:"Ali och Sara ser en drake. Draken dansar runt, runt. Sara skrattar. Ali skrattar. Draken dansar.",fraga:"Vad gör draken?",svar:["dansar","sover","simmar"]},
{id:"2-10",niva:2,text:"Tim har ont i armen. Tim ska till en doktor. Doktorn kollar armen. Doktorn lindar armen. Nu ler Tim.",fraga:"Var har Tim ont?",svar:["i armen","i en tand","i en tumme"]},
{id:"2-11",niva:2,text:"Det är kalas! Kim, Ida, Tuva och Ola kommer. De sitter runt en duk. De leker kull. Kalaset var kul!",fraga:"Hur var kalaset?",svar:["kul","surt","kallt"]},
{id:"2-12",niva:2,text:"Mira och mormor ska ut. De ser en stor sten. De sitter vid stenen. Mormor tar ut en kaka. De mumsar och ler.",fraga:"Vad tar mormor ut?",svar:["en kaka","en sten","en kudde"]},
// ---------- Nivå 3: + G B P H ----------
{id:"3-01",niva:3,text:"Bo har en hund. Hunden heter Pim. Pim gillar att springa. Pim hoppar och springer i parken. Bo springer med. Nu vilar de.",fraga:"Vad heter hunden?",svar:["Pim","Bo","Hugo"]},
{id:"3-02",niva:3,text:"Det regnar. Hanna hoppar i vattnet. Plask! Plask! Mamma tittar ut. Mamma sa: Hanna, kom in nu! Hanna kommer in. Hon är glad.",fraga:"Var hoppar Hanna?",svar:["i vattnet","i sanden","i ladan"]},
{id:"3-03",niva:3,text:"Pappa bakar bullar. Gustav rullar degen. Bullarna bakas i ugnen. Mm, det luktar gott! Gustav tar en bulle. Den är het!",fraga:"Vad bakar pappa?",svar:["bullar","kakor","pannkakor"]},
{id:"3-04",niva:3,text:"Hos Petra bor en gris, en get och en hund. Grisen gillar lera. Geten tuggar blad. Hunden springer runt. Petra ger dem mat. Alla blir glada.",fraga:"Vad gillar grisen?",svar:["lera","bullar","regn"]},
{id:"3-05",niva:3,text:"Bussen kommer. Hampus och pappa hoppar in. Bussen rullar genom staden. Hampus ser bilar, hus och en park. Pling! Nu ska de av.",fraga:"Vad ser Hampus?",svar:["bilar och hus","kor och grisar","bara regn"]},
{id:"3-06",niva:3,text:"Gabriel staplar klossar till ett torn. Tornet blir stort. Det blir hela tio klossar. Sedan kommer katten Pelle. Bom! Tornet ramlar. Gabriel skrattar.",fraga:"Vem gör att tornet ramlar?",svar:["katten Pelle","Gabriel","mamma"]},
{id:"3-07",niva:3,text:"Hugo ska bada. Han tar en badanka. Ankan guppar i vattnet. Hugo plaskar. Ankan hoppar upp! Ha ha, sa Hugo.",fraga:"Vad guppar i vattnet?",svar:["en anka","en bulle","en hund"]},
{id:"3-08",niva:3,text:"Bella och Hamid sitter i parken. De har bullar och te. En humla surrar runt. Bella hoppar upp. Humlan vill bara ha en bulle!",fraga:"Vad surrar runt?",svar:["en humla","en hund","en bil"]},
{id:"3-09",niva:3,text:"Pirat Pelle har en karta. Han letar och letar. Han tittar under en palm. Han hittar en kista! I kistan ligger guld. Pirat Pelle dansar.",fraga:"Vad hittar Pelle?",svar:["en kista","en hund","en buss"]},
{id:"3-10",niva:3,text:"Ibrahim ser en igelkott. Igelkotten har massor av taggar. Den nosar i gruset. Sedan rullar den ihop sig till en boll.",fraga:"Vad gör igelkotten till sist?",svar:["rullar ihop sig","simmar","hoppar upp"]},
{id:"3-11",niva:3,text:"Hemma hos Greta bor en gammal hund. Han heter Bob. Bob sover hela dagen. Men om Greta tar en boll, hoppar Bob upp. Bob vill leka!",fraga:"Vad gör Bob hela dagen?",svar:["sover","leker","springer"]},
{id:"3-12",niva:3,text:"Pappa och Lisa ska handla. Lisa tar bananer, paprika och glass. Pappa sa: Det blir tio kronor. Lisa betalar. Hon tar glassen hem.",fraga:"Vad tar Lisa?",svar:["bananer och glass","bullar och te","en hund"]},
// ---------- Nivå 4: + Å Ä Ö ----------
{id:"4-01",niva:4,text:"Det är vinter. Snön ligger vit på marken. Leo och Saga gör en snögubbe. Han har en morot som näsa och två stenar som ögon. Snögubben ler.",fraga:"Vad har snögubben som näsa?",svar:["en morot","en sten","en gurka"]},
{id:"4-02",niva:4,text:"Elsa går till skolan. På vägen ser hon en räv. Räven står helt still och tittar på henne. Sedan springer den in i skogen. Elsa berättar det i skolan.",fraga:"Vad ser Elsa på vägen?",svar:["en räv","en hund","en häst"]},
{id:"4-03",niva:4,text:"Mormor bakar en äppelkaka. Hon skalar äpplen och skär dem i bitar. Det luktar gott i hela huset. Sedan äter alla kakan med glass.",fraga:"Vad bakar mormor?",svar:["en äppelkaka","bullar","bröd"]},
{id:"4-04",niva:4,text:"Ett ägg ligger i ett bo. Plötsligt knakar det. En liten unge tittar ut. Den är grå och lurvig. Mamma måsen kommer med mat.",fraga:"Vem kommer med mat?",svar:["mamma måsen","en räv","en katt"]},
{id:"4-05",niva:4,text:"Det är höst. Löven är röda, gula och bruna. Tuva och Ali krattar löven till en stor hög. Sedan hoppar de rakt ner i högen. Prassel, prassel!",fraga:"Vilka färger har löven?",svar:["röda, gula och bruna","blå och lila","vita och svarta"]},
{id:"4-06",niva:4,text:"Omar sitter på tåget. Han ser kor, hästar och åkrar. Tåget åker snabbt. Omar äter en smörgås. Om en timme är han hos mormor.",fraga:"Vart åker Omar?",svar:["till mormor","till skolan","till stranden"]},
{id:"4-07",niva:4,text:"Nora har ont i magen. Hon ligger i sängen hela dagen. Pappa läser en saga. Han kokar te med honung. På kvällen mår Nora bättre.",fraga:"Vad läser pappa?",svar:["en saga","en tidning","en karta"]},
{id:"4-08",niva:4,text:"Lukas och Ebba sitter på en stor sten vid ån. De metar. Plötsligt nappar det! Lukas drar upp en abborre. Den är stor och glänsande.",fraga:"Vad drar Lukas upp?",svar:["en abborre","en sko","en sten"]},
{id:"4-09",niva:4,text:"Det är Saras tur att duka. Hon lägger ut tallrikar, glas och knivar. Sedan ställer hon en vas med blommor på bordet. Nu kan alla äta.",fraga:"Vad ställer Sara på bordet?",svar:["en vas med blommor","en hund","en katt"]},
{id:"4-10",niva:4,text:"Vi går till badet. Vattnet är kallt. Hugo vågar inte hoppa. Han står länge på kanten. Till sist hoppar han. Plask! Det var inte så läskigt.",fraga:"Var står Hugo länge?",svar:["på kanten","i vattnet","i bastun"]},
{id:"4-11",niva:4,text:"Det är natt. Alla sover utom Mira. Hon hör något i köket. Hon tassar ner. Där står katten och äter ur skålen. Mira skrattar och går och lägger sig.",fraga:"Vem är i köket?",svar:["katten","pappa","en tomte"]},
{id:"4-12",niva:4,text:"Det är midsommar. Barnen dansar runt stången. Alla har kransar av blommor på huvudet. Sedan äter alla tårta med grädde.",fraga:"Vad har alla på huvudet?",svar:["kransar av blommor","mössor","hattar"]},
// ---------- Nivå 5: + F J Y C X Z W Q (alla bokstäver) ----------
{id:"5-01",niva:5,text:"Josefin har fått en kattunge. Den är svart och vit och heter Sixten. Sixten jagar allt som rör sig: bollar, snören och till och med Josefins fötter. På kvällen somnar han i hennes knä.",fraga:"Vad heter kattungen?",svar:["Sixten","Josefin","Pelle"]},
{id:"5-02",niva:5,text:"Familjen åker till fjällen. Det är kallt och snön glittrar. Yasmin åker skidor för första gången. Hon ramlar fem gånger, men hon reser sig varje gång. Till slut åker hon hela backen utan att ramla.",fraga:"Hur många gånger ramlar Yasmin?",svar:["fem","en","tio"]},
{id:"5-03",niva:5,text:"Felix vill bli astronaut. Han bygger en raket av en kartong. Han klipper ut fönster och målar stjärnor på sidorna. Sedan sätter han sig i raketen och räknar ner: tre, två, ett, nu åker vi!",fraga:"Vad bygger Felix raketen av?",svar:["en kartong","plåt","trä"]},
{id:"5-04",niva:5,text:"På zoo bor en zebra. Zebran har svarta och vita ränder. Inga zebror har likadana ränder. Därför kan zebrorna känna igen varandra, precis som vi känner igen ansikten.",fraga:"Vilka färger har zebrans ränder?",svar:["svarta och vita","röda och gula","blå och gröna"]},
{id:"5-05",niva:5,text:"Det har snöat hela natten. Wilma och Jack tar fram pulkan. De åker ner för backen, gång på gång. Kinderna blir röda av kylan. Sedan dricker de varm choklad i köket.",fraga:"Vad dricker de sedan?",svar:["varm choklad","kall saft","vatten"]},
{id:"5-06",niva:5,text:"Mattias hittar en fågelunge på marken. Den kan inte flyga än. Mattias vill hjälpa den, men pappa säger att de ska låta den vara. Fågelmamman kommer snart och tar hand om sin unge.",fraga:"Vad säger pappa?",svar:["låt den vara","ta hem den","ge den mat"]},
{id:"5-07",niva:5,text:"Varje fredag är det fredagsmys hos Jonna. Hela familjen sitter i soffan. De äter popcorn och tittar på en film. Lillebror somnar alltid innan filmen är slut.",fraga:"Vem somnar alltid?",svar:["lillebror","Jonna","pappa"]},
{id:"5-08",niva:5,text:"Xenia spelar xylofon i skolans orkester. Hon övar varje dag efter skolan. På fredag är det konsert. Xenia är lite nervös, men när musiken börjar glömmer hon allt och bara spelar.",fraga:"Vilket instrument spelar Xenia?",svar:["xylofon","fiol","trumma"]},
{id:"5-09",niva:5,text:"Hjalmar och hans kompis gör en hemlig karta. De gräver ner en burk med kulor under en stor ek. På kartan ritar de ett kryss. Nästa sommar ska de leta upp skatten igen.",fraga:"Var gräver de ner burken?",svar:["under en stor ek","i sandlådan","vid sjön"]},
{id:"5-10",niva:5,text:"Citronen är gul och sur. Om man pressar den får man saft. Mamma blandar citronsaft, vatten och lite socker. Det blir lemonad. Cecilia dricker ett helt glas: Sur men god!",fraga:"Vad blir det av citronsaft, vatten och socker?",svar:["lemonad","mjölk","soppa"]},
{id:"5-11",niva:5,text:"Quintus är en kvick liten hund som älskar att springa. I parken jagar han duvor och ekorrar. Han fångar aldrig någon, men han ger aldrig upp. Hemma dricker han vatten och sover tungt.",fraga:"Vad jagar Quintus?",svar:["duvor och ekorrar","bilar","katter"]},
{id:"5-12",niva:5,text:"När William fyller år får han välja middag. Han väljer pizza med extra ost. Mormor bakar en tårta med jordgubbar. Alla sjunger för honom, och William blåser ut alla nio ljus på en gång.",fraga:"Hur många ljus blåser William ut?",svar:["nio","fem","tolv"]}
];
/* Bokstäverna: nyckelord och bild (ritas i scener.js). Den vuxne säger ljudet och namnet. */
window.BOKSTAVER={S:"sol",O:"orm",L:"lamm",A:"ananas",R:"ren",M:"mus",E:"ek",V:"val",I:"is",N:"nalle",
  T:"tomat",D:"drake",U:"uggla",K:"katt",G:"groda",B:"banan",P:"pingvin",H:"hund",Å:"åra",Ä:"äpple",Ö:"öga",
  F:"fisk",J:"jordgubbe",Y:"yxa",C:"citron",X:"xylofon",Z:"zebra",W:"wok",Q:"quiz"};
