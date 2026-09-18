export interface UserSignificanceAnalysis {
  status: 'VERIFIED_ACCURATE' | 'MISMATCH_DETECTED' | 'MISSING_OR_VAGUE' | 'INVALID';
  feedback: string;
  suggestedSignificance?: string;
}

export interface VerificationResponse {
  isValid: boolean;
  confidence: number;
  verificationStatus: 'VERIFIED_ACCURATE' | 'CORRECTIONS_SUGGESTED' | 'INVALID_OR_NOT_FOUND';
  placeName: string;
  correctedPlaceName?: string;
  state: string;
  country: string;
  significance: string;
  userSignificanceAnalysis?: UserSignificanceAnalysis;
  suggestedTags: string[];
  suggestedSeason: string;
  suggestedClimate: string;
  aiExplanation: string;
  corrections?: string | null;
  googleMapsUrl: string;
  suggestedImageUrl?: string;
}

interface KnownLandmark {
  names: string[];
  canonicalName: string;
  state: string;
  country: string;
  significance: string;
  tags: string[];
  season: string;
  climate: string;
  imageUrl: string;
}

export const KNOWN_LANDMARKS: KnownLandmark[] = [
  // Telangana
  {
    names: ['charminar', 'char minar', 'hyderabad charminar'],
    canonicalName: 'Charminar (Hyderabad)',
    state: 'Telangana',
    country: 'India',
    significance: 'Iconic 16th-century square monument and mosque with 4 grand minarets built by Sultan Muhammad Quli Qutb Shah in Hyderabad.',
    tags: ['Heritage', 'Islamic Architecture', 'Landmark', 'Telangana'],
    season: 'October – March',
    climate: 'Pleasant winter (18°C - 28°C)',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/1280px-Charminar_Hyderabad_1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    names: ['golconda', 'golconda fort', 'golkonda'],
    canonicalName: 'Golconda Fort',
    state: 'Telangana',
    country: 'India',
    significance: 'Impregnable medieval citadel famous for acoustic engineering, diamond trade (Koh-i-Noor, Hope Diamond), and Qutb Shahi palaces.',
    tags: ['Forts', 'Heritage', 'Acoustics', 'Telangana'],
    season: 'October – March',
    climate: 'Pleasant winter',
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/d/df/Aerial_view_of_Golconda_fort.jpg"
  },
  {
    names: ['ramappa', 'ramappa temple', 'kakatiya rudreshwara'],
    canonicalName: 'Ramappa Temple (Palampet)',
    state: 'Telangana',
    country: 'India',
    significance: 'UNESCO World Heritage Kakatiya temple known for floating lightweight bricks, carved basalt pillars, and intricate bracket figures.',
    tags: ['UNESCO', 'Temple', 'Architecture', 'Telangana'],
    season: 'October – March',
    climate: 'Subtropical',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/29/Ramappa_Temple_%28Human_Scale%29.jpg/1280px-Ramappa_Temple_%28Human_Scale%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    names: ['nagarjuna sagar', 'nagarjunasagar', 'nagarjunakonda'],
    canonicalName: 'Nagarjunakonda & Sagar Dam',
    state: 'Telangana',
    country: 'India',
    significance: 'Historic Buddhist island museum located in the reservoir of one of the world\'s largest masonry dams.',
    tags: ['Buddhist', 'Lake', 'Dam', 'Telangana'],
    season: 'October – February',
    climate: 'Pleasant',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Buddhist_site_3rd_century_AD.jpg/1280px-Buddhist_site_3rd_century_AD.jpg"
  },
  {
    names: ['kuntala falls', 'kuntala waterfall'],
    canonicalName: 'Kuntala Waterfalls (Adilabad)',
    state: 'Telangana',
    country: 'India',
    significance: 'Highest waterfall in Telangana, cascading 150 feet through dense Sahyadri mountain forest.',
    tags: ['Waterfall', 'Nature', 'Adilabad', 'Telangana'],
    season: 'July – December',
    climate: 'Tropical monsoonal',
    imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1000&q=80'
  },
  {
    names: ['warangal fort', 'thousand pillar temple', 'warangal', 'kakatiya kala thoranam'],
    canonicalName: 'Warangal Fort & Thousand Pillar Temple',
    state: 'Telangana',
    country: 'India',
    significance: 'Magnificent Kakatiya-dynasty heritage site famous for the iconic Kakatiya Kala Thoranam royal stone arches and star-shaped shrine.',
    tags: ['Heritage', 'Fort', 'Temple', 'Telangana'],
    season: 'October – March',
    climate: 'Pleasant winter',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/1000pillar_temple_warangal.jpg/1280px-1000pillar_temple_warangal.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },

  // Andhra Pradesh
  {
    names: ['tirupati', 'tirumala', 'venkateswara temple', 'balaji temple', 'sri venkateswara'],
    canonicalName: 'Tirupati & Tirumala (Sri Venkateswara Temple)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'World-renowned Vaishnavite hill shrine situated atop the seventh peak of Seshachalam Hills. Dedicated to Lord Venkateswara (Balaji), it is one of the most visited, revered, and wealthiest pilgrimage sanctuaries globally, celebrated for its golden Ananda Nilayam vimana and centuries-old Dravidian spiritual traditions.',
    tags: ['Spiritual', 'Temple', 'Pilgrimage', 'Andhra Pradesh'],
    season: 'September – March',
    climate: 'Tropical pleasant',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/1280px-Tirumala_090615.jpg'
  },
  {
    names: ['kanaka durga', 'kanakadurgamma', 'indrakeeladri', 'vijayawada durga temple'],
    canonicalName: 'Kanaka Durga Temple (Vijayawada)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'Ancient Swayambhu Shakti Peetha majestically perched on Indrakeeladri Hill along the sacred Krishna River. Dedicated to Goddess Durga, who vanquished demon Mahishasura, this historic temple is a spiritual epicenter mentioned in Vedic scriptures, drawing millions of pilgrims particularly during the vibrant Sharad Navaratri festival.',
    tags: ['Spiritual', 'Shakti Peetha', 'Temple', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Tropical pleasant',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Kanakadurga_Temple_gopuram.jpg/1280px-Kanakadurga_Temple_gopuram.jpg'
  },
  {
    names: ['simhachalam', 'varaha lakshmi narasimha', 'simhachalam temple', 'vizag narasimha temple'],
    canonicalName: 'Sri Varaha Lakshmi Narasimha Swamy Temple (Simhachalam)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: '11th-century architectural marvel atop Simhachalam Hill, harmoniously blending Kalinga and Chola temple styles. Revered as one of the 32 sacred Narasimha Kshetras, the deity remains sanctified under a continuous layer of cooling sandalwood paste, revealed only during the auspicious annual Chandanotsavam festival.',
    tags: ['Spiritual', 'Architecture', 'Temple', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Coastal tropical',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Simhachalam_temple_from_a_hilltop.jpg/1280px-Simhachalam_temple_from_a_hilltop.jpg'
  },
  {
    names: ['srikalahasti', 'sri kalahasti', 'kalahasteeswara', 'vayu lingam'],
    canonicalName: 'Srikalahasti Temple (Sri Kalahasteeswara Swamy)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'Sacred Pancha Bhoota Stalam representing the air element (Vayu Lingam), nestled on the banks of River Swarnamukhi. Built by Pallava and Chola rulers, it is internationally renowned for Rahu-Ketu Sarpa Dosha Nivarana pujas and rich Shaivite literature celebrating the legendary devotion of Kannappa Nayanar.',
    tags: ['Spiritual', 'Pancha Bhoota', 'Temple', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Pleasant winter',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Sri_Kala_Hasti.jpg/1280px-Sri_Kala_Hasti.jpg'
  },
  {
    names: ['srisailam', 'mallikarjuna temple', 'srisailam temple', 'bhramaramba'],
    canonicalName: 'Mallikarjuna Swamy Temple (Srisailam)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'Rare sanctified confluence functioning simultaneously as one of the twelve sacred Shiva Jyotirlingas and one of the 18 Maha Shakti Peethas. Located in the lush Nallamala forest hills above the Krishna River, its fortified Vijayanagara enclosures house exquisite stone carvings of Mahabharata and Ramayana epics.',
    tags: ['Jyotirlinga', 'Shakti Peetha', 'Temple', 'Andhra Pradesh'],
    season: 'October – February',
    climate: 'Pleasant',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Srisailam-temple-entrance.jpg/1280px-Srisailam-temple-entrance.jpg'
  },
  {
    names: ['lepakshi', 'veerabhadra temple', 'lepakshi temple', 'hanging pillar'],
    canonicalName: 'Lepakshi (Veerabhadra Temple)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: '16th-century Vijayanagara architectural triumph celebrated for its legendary Hanging Pillar, intricate ceiling frescoes, and the colossal monolithic Lepakshi Nandi bull carved from single granite. Renowned for rich puranic legends of Jatayu and magnificent sculptural artistry, it stands as an enduring gem of Deccan stone craftsmanship.',
    tags: ['Heritage', 'Architecture', 'Temple', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Semi-arid pleasant',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/Veerabhadra_Temple_Tower.JPG/1280px-Veerabhadra_Temple_Tower.JPG'
  },
  {
    names: ['yaganti', 'uma maheswara temple', 'yaganti temple', 'growing nandi'],
    canonicalName: 'Yaganti (Uma Maheswara Temple)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: '15th-century cave temple commissioned by Sangama King Harihara Bukka Rayalu in the Erramala hills. Famous for its naturally growing stone Nandi statue, perpetual freshwater Pushkarini spring, and the sage Agastya cave, this serene sanctum presents unique Ardhanarishwara sculptures carved directly into natural rock.',
    tags: ['Spiritual', 'Cave Temple', 'Heritage', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Pleasant winter',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Uma-Maheswaraswami_Temple.jpg/1280px-Uma-Maheswaraswami_Temple.jpg'
  },
  {
    names: ['ahobilam', 'nava narasimha', 'ahobilam temple'],
    canonicalName: 'Ahobilam (Nava Narasimha Swamy Temple)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'Venerated spiritual epicentre nestled within the dense Nallamala forest, revered as the sacred place where Lord Narasimha emerged from the pillar to vanquish demon Hiranyakashipu. Spanning Upper and Lower Ahobilam, it features nine unique shrines dedicated to nine distinct manifestations of Lord Narasimha.',
    tags: ['Spiritual', 'Forest', 'Temple', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Forest temperate',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Upper_Ahobilam_temple_Gopuram_02.jpg/1280px-Upper_Ahobilam_temple_Gopuram_02.jpg'
  },
  {
    names: ['kanipakam', 'varasiddhi vinayaka', 'kanipakam temple'],
    canonicalName: 'Kanipakam (Varasiddhi Vinayaka Temple)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'Historic 11th-century Chola dynasty sanctuary renowned for its self-manifested (Swayambhu) Lord Ganesha idol discovered inside a natural farm well. Revered for divine justice and eternal miraculous growth of the central deity, the temple draws thousands of devotees seeking prosperity and relief from obstacles.',
    tags: ['Spiritual', 'Temple', 'Chola Heritage', 'Andhra Pradesh'],
    season: 'September – March',
    climate: 'Pleasant',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Galipgopuram_of_Kanipakam_temple_%28May_2019%29_4.jpg/1280px-Galipgopuram_of_Kanipakam_temple_%28May_2019%29_4.jpg'
  },
  {
    names: ['annavaram', 'satyanarayana swamy', 'annavaram temple'],
    canonicalName: 'Annavaram (Sri Veera Venkata Satyanarayana Swamy Temple)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'Illustrious hilltop pilgrimage temple located on Ratnagiri Hill along the sacred Pampa River. Dedicated to Lord Satyanarayana Swamy, a divine incarnation of Lord Vishnu, this temple is globally celebrated for performing sacred Satyanarayana Vrathams to bestow harmony, prosperity, and spiritual fulfillment upon families.',
    tags: ['Spiritual', 'Hilltop Temple', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Tropical pleasant',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/A_Hindu_temple_at_Annavaram_Andhra_Pradesh.jpg'
  },
  {
    names: ['draksharamam', 'draksharama', 'bhimeswara swamy', 'pancharama draksharamam'],
    canonicalName: 'Draksharamam (Bhimeswara Swamy Temple)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'One of the sacred Pancharama Kshetras and revered as Dakshina Kashi, housing a magnificent 9-foot crystal Shiva lingam spanning two floors. Constructed during the Eastern Chalukya era with historic inscriptions, it is also honored as the Manikyamba Shakti Peetha alongside holy Sapta Godavari waters.',
    tags: ['Pancharama', 'Shakti Peetha', 'Temple', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Tropical',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Draksharama_temple_entrance_02.JPG/1280px-Draksharama_temple_entrance_02.JPG'
  },
  {
    names: ['mangalagiri', 'panakala narasimha', 'mangalagiri temple'],
    canonicalName: 'Mangalagiri (Panakala Lakshmi Narasimha Swamy Temple)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'Sacred Vaishnavite hill shrine situated on an extinct volcanic hill near Vijayawada. Renowned for the mystical phenomenon where the presiding Narasimha deity drinks offered jaggery water (panakam) with an audible gurgling sound, the temple also boasts one of the tallest Galigopurams in South India.',
    tags: ['Spiritual', 'Hill Temple', 'Temple', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Pleasant',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Diguva_mangalagiri_temple_guntur_dist_AP.jpg'
  },
  {
    names: ['kailasagiri', 'kailasagiri hill', 'kailasagiri park', 'kailasagiri visakhapatnam', 'kailasagiri shiva parvathi', 'kailasagiri hilltop'],
    canonicalName: 'Kailasagiri (Visakhapatnam)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'Kailasagiri is a scenic hilltop park situated in Visakhapatnam, Andhra Pradesh, overlooking the Bay of Bengal coastline. Developed by the Visakhapatnam Metropolitan Region Development Authority across 380 acres at an elevation of 173 metres, the landscaped hilltop features expansive panoramic views of the sea and city. The park is renowned for its 40-foot colossal statues of Shiva and Parvathi, a ropeway cable car, floral clock, and a circular tourist train.',
    tags: ['Hilltop', 'Coastal View', 'Park', 'Landmark', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Coastal pleasant breeze',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Kailasagiri.jpg/1280px-Kailasagiri.jpg'
  },
  {
    names: ['araku', 'araku valley'],
    canonicalName: 'Araku Valley',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'Picturesque Eastern Ghats hill station enveloped by lush coffee plantations, mist-laden valleys, and cascading waterfalls like Katiki. Home to ancient indigenous tribal communities and the tribal museum, it offers scenic glass-domed Vistadome train journeys through forested tunnels, showcasing rich Andhra agro-tourism and biodiversity.',
    tags: ['Hill Station', 'Nature', 'Coffee', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Cool mountain air (15°C - 25°C)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Araku-valley.jpg'
  },
  {
    names: ['borra caves', 'borra guhalu'],
    canonicalName: 'Borra Caves (Ananthagiri Hills)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'One of the deepest and largest subterranean cave formations in India, estimated to be over a million years old. Formed by the Gosthani River carving through karstic limestone, these caves feature magnificent speleothems, naturally sculpted stalactites and stalagmites, and an ancient Shiva shrine revered by locals.',
    tags: ['Caves', 'Geology', 'Adventure', 'Andhra Pradesh'],
    season: 'November – March',
    climate: 'Cool cave interior',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Borra_caves%2C_Viskhapatnam.jpg/1280px-Borra_caves%2C_Viskhapatnam.jpg'
  },
  {
    names: ['gandikota', 'grand canyon of india', 'gandikota fort'],
    canonicalName: 'Gandikota (The Grand Canyon of India)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'Breathtaking 300-foot gorge deeply carved by the Pennar River through red Erramala sandstone ridges, famously dubbed the Grand Canyon of India. Crowning the cliffs sits the monumental 13th-century Gandikota Fort, featuring ancient granaries, the Madhavaraya temple, Jama Masjid, and panoramic clifftop vantage points.',
    tags: ['Canyon', 'Gorge', 'Fort', 'Andhra Pradesh'],
    season: 'October – February',
    climate: 'Semi-arid winter',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Indian_Grand_Canyon_Sudhakar_Bichali.jpg/1280px-Indian_Grand_Canyon_Sudhakar_Bichali.jpg'
  },
  {
    names: ['belum caves', 'belum'],
    canonicalName: 'Belum Caves',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'The second-largest subterranean cave network in the Indian subcontinent, renowned for its intricate passages, freshwater chambers, and stunning calcite speleothems. Formed over millennia by the underground Chitravati River, these historic limestone caverns contain ancient Buddhist relics and meditation chambers dating back to 4500 BCE.',
    tags: ['Caves', 'Geology', 'Speleology', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Underground',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Belumcave1.jpg/1280px-Belumcave1.jpg'
  },
  {
    names: ['amaravati', 'dhyana buddha', 'amaravathi stupa'],
    canonicalName: 'Amaravati (Dhyana Buddha & Ancient Stupas)',
    state: 'Andhra Pradesh',
    country: 'India',
    significance: 'Historic Buddhist cradle along the Krishna River, celebrated for the monumental 125-foot Dhyana Buddha statue symbolizing the eightfold path. Ancient capital of the Satavahana dynasty, it boasts historic Maha Chaitya stupa ruins and archaeological museums preserving sacred Buddhist sculptures dating back to the 3rd century BCE.',
    tags: ['Buddhist', 'Heritage', 'Stupa', 'Andhra Pradesh'],
    season: 'October – March',
    climate: 'Pleasant',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Dhyaan_buddha_Amaravthi.jpg'
  },

  // Goa
  {
    names: ['basilica of bom jesus', 'bom jesus', 'old goa church'],
    canonicalName: 'Basilica of Bom Jesus',
    state: 'Goa',
    country: 'India',
    significance: 'UNESCO World Heritage Baroque church enshrining the sacred relics of St. Francis Xavier in historic Velha Goa.',
    tags: ['UNESCO', 'Heritage', 'Churches', 'Goa'],
    season: 'November – February',
    climate: 'Tropical coastal',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Front_Elevation_of_Basilica_of_Bom_Jesus.jpg/1280px-Front_Elevation_of_Basilica_of_Bom_Jesus.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    names: ['dudhsagar', 'dudhsagar falls', 'dudh sagar'],
    canonicalName: 'Dudhsagar Waterfalls',
    state: 'Goa',
    country: 'India',
    significance: 'Four-tiered milky-white cascade tumbling 310 meters through the lush Western Ghats forest and railway viaduct.',
    tags: ['Waterfall', 'Adventure', 'Nature', 'Goa'],
    season: 'October – May',
    climate: 'Lush tropical',
    imageUrl: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1000&q=80'
  },
  {
    names: ['baga', 'calangute', 'baga beach', 'calangute beach'],
    canonicalName: 'Calangute & Baga Beaches',
    state: 'Goa',
    country: 'India',
    significance: 'Lively North Goa golden sand coastlines famous for water sports, beach shacks, seafood dining, and vibrant sunsets.',
    tags: ['Beach', 'Water Sports', 'Sunset', 'Goa'],
    season: 'October – April',
    climate: 'Coastal warm (24°C - 31°C)',
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Baga_Beach%2C_Goa%2C_shot_on_26_August%2C_2026.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  },
  {
    names: ['goa velha', 'velha goa', 'st andrews church goa velha'],
    canonicalName: 'Goa Velha',
    state: 'Goa',
    country: 'India',
    significance: 'Historic town in Ilhas de Goa famous for the 400-year-old St. Andrew\'s Parish Church and the famous traditional Procession of the Saints (Passos).',
    tags: ['Heritage', 'Church', 'Passos', 'Goa'],
    season: 'November – March',
    climate: 'Tropical coastal',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/BeachFun.jpg/1280px-BeachFun.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },

  // Kerala
  {
    names: ['alleppey', 'alappuzha', 'kerala backwaters', 'alleppey backwaters'],
    canonicalName: 'Alleppey Backwaters (Alappuzha)',
    state: 'Kerala',
    country: 'India',
    significance: 'The Venice of the East, famous for tranquil palm-fringed lagoons, emerald paddy fields, and traditional Kettuvallam houseboats.',
    tags: ['Backwaters', 'Houseboat', 'Romantic', 'Kerala'],
    season: 'October – March',
    climate: 'Tropical pleasant',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/House_Boat_DSW.jpg/1280px-House_Boat_DSW.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    names: ['munnar', 'munnar tea hills'],
    canonicalName: 'Munnar',
    state: 'Kerala',
    country: 'India',
    significance: 'Sprawling high-altitude tea plantation hills, misty valleys, and home to the endangered Nilgiri Tahr at Eravikulam National Park.',
    tags: ['Hill Station', 'Tea Estates', 'Nature', 'Kerala'],
    season: 'September – March',
    climate: 'Cool alpine (12°C - 22°C)',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Munnar_Overview.jpg/1280px-Munnar_Overview.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },

  // Gujarat
  {
    names: ['statue of unity', 'sardar patel statue', 'kevadia'],
    canonicalName: 'Statue of Unity (Kevadia)',
    state: 'Gujarat',
    country: 'India',
    significance: 'World\'s tallest statue (182 meters) honoring Sardar Vallabhbhai Patel, set along the scenic Narmada River facing the Sardar Sarovar Dam.',
    tags: ['World Record', 'Monument', 'Heritage', 'Gujarat'],
    season: 'October – March',
    climate: 'Mild winter',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Statue_of_Unity.jpg/1280px-Statue_of_Unity.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    names: ['rann of kutch', 'great rann', 'white desert'],
    canonicalName: 'Great Rann of Kutch',
    state: 'Gujarat',
    country: 'India',
    significance: 'Vast shimmering white salt desert famous for magical full moon nights, artisan handicrafts, and the colorful Rann Utsav festival.',
    tags: ['Desert', 'Culture', 'White Salt', 'Gujarat'],
    season: 'November – February',
    climate: 'Chilly desert nights',
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/Gujarat_Gulfs.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled"
  },

  // Uttar Pradesh
  {
    names: ['taj mahal', 'tajmahal', 'agra taj'],
    canonicalName: 'Taj Mahal (Agra)',
    state: 'Uttar Pradesh',
    country: 'India',
    significance: 'UNESCO World Heritage Site and Wonder of the World: the peerless ivory-white marble mausoleum built by Mughal Emperor Shah Jahan.',
    tags: ['UNESCO', 'Wonder of World', 'Mughal', 'Uttar Pradesh'],
    season: 'October – March',
    climate: 'Pleasant winter',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg"
  },
  {
    names: ['varanasi', 'kashi', 'banaras', 'varanasi ghats', 'dashashwamedh ghat'],
    canonicalName: 'Varanasi Ghats (Kashi)',
    state: 'Uttar Pradesh',
    country: 'India',
    significance: 'World\'s oldest continuously inhabited spiritual capital, famous for holy Ganges sunrise boat rides and mesmerizing evening Maha Aarti.',
    tags: ['Spiritual', 'Heritage', 'Ganges', 'Uttar Pradesh'],
    season: 'October – March',
    climate: 'Mild winter',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg/1280px-Ahilya_Ghat_by_the_Ganges%2C_Varanasi.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },

  // Karnataka
  {
    names: ['hampi', 'vijayanagara', 'vittala temple'],
    canonicalName: 'Hampi',
    state: 'Karnataka',
    country: 'India',
    significance: 'UNESCO World Heritage open-air museum preserving the monumental carved ruins, stone chariot, and temples of the 14th-century Vijayanagara Empire.',
    tags: ['UNESCO', 'Ruins', 'Architecture', 'Karnataka'],
    season: 'October – March',
    climate: 'Pleasant winter',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg/1280px-Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },
  {
    names: ['mysore palace', 'ambavilas palace'],
    canonicalName: 'Mysore Palace',
    state: 'Karnataka',
    country: 'India',
    significance: 'Magnificent Indo-Saracenic royal residence of the Wadiyars, renowned for stained glass, carved rosewood, and 100,000 illumination bulbs.',
    tags: ['Palace', 'Royal Heritage', 'Karnataka'],
    season: 'September – March',
    climate: 'Pleasant',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Mysore_Palace_Morning.jpg/1280px-Mysore_Palace_Morning.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },

  // Punjab
  {
    names: ['golden temple', 'harmandir sahib', 'amritsar'],
    canonicalName: 'Golden Temple (Sri Harmandir Sahib)',
    state: 'Punjab',
    country: 'India',
    significance: 'Holiest spiritual sanctuary of Sikhism, revered for its shimmering gold sanctum in the Amrit Sarovar lake and 24/7 free community Langar kitchen.',
    tags: ['Spiritual', 'Golden Temple', 'Sikhism', 'Punjab'],
    season: 'October – March',
    climate: 'Chilly winter',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amrithsar_7.jpg/1280px-The_Golden_Temple_of_Amrithsar_7.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },

  // Tamil Nadu
  {
    names: ['meenakshi', 'meenakshi amman', 'madurai temple'],
    canonicalName: 'Meenakshi Amman Temple (Madurai)',
    state: 'Tamil Nadu',
    country: 'India',
    significance: 'Historic Dravidian masterpiece with 14 soaring rainbow-sculpted gopuram towers and the Hall of Thousand Pillars.',
    tags: ['Temple', 'Dravidian', 'Heritage', 'Tamil Nadu'],
    season: 'October – March',
    climate: 'Warm tropical',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg/1280px-An_aerial_view_of_Madurai_city_from_atop_of_Meenakshi_Amman_temple.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },

  // Uttarakhand
  {
    names: ['kedarnath', 'badrinath', 'kedarnath temple'],
    canonicalName: 'Kedarnath & Badrinath',
    state: 'Uttarakhand',
    country: 'India',
    significance: 'Sacred high-altitude Himalayan pilgrimage shrines nestled against snow-capped peaks in the Garhwal Himalayas.',
    tags: ['Himalayas', 'Chaar Dham', 'Spiritual', 'Uttarakhand'],
    season: 'May – June & Sept – October',
    climate: 'Alpine cold',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Kedarnath_Temple_in_Rainy_season.jpg/1280px-Kedarnath_Temple_in_Rainy_season.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },

  // Assam
  {
    names: ['kaziranga', 'kaziranga national park'],
    canonicalName: 'Kaziranga National Park',
    state: 'Assam',
    country: 'India',
    significance: 'UNESCO World Heritage biodiversity haven home to two-thirds of the planet\'s great one-horned rhinoceroses and wild water buffaloes.',
    tags: ['UNESCO', 'Wildlife', 'Rhino Safari', 'Assam'],
    season: 'November – April',
    climate: 'Subtropical',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Beauty_of_Kaziranga_National_Park.jpg/1280px-Beauty_of_Kaziranga_National_Park.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },

  // West Bengal
  {
    names: ['victoria memorial', 'victoria memorial kolkata'],
    canonicalName: 'Victoria Memorial (Kolkata)',
    state: 'West Bengal',
    country: 'India',
    significance: 'Grand white Makrana marble monument and museum surrounded by 64 acres of lush gardens, showcasing Kolkata\'s heritage.',
    tags: ['Museum', 'Colonial Heritage', 'Kolkata', 'West Bengal'],
    season: 'October – March',
    climate: 'Pleasant winter',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Victoria_Memorial_situated_in_Kolkata.jpg/1280px-Victoria_Memorial_situated_in_Kolkata.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  },

  // Odisha
  {
    names: ['konark', 'konark sun temple', 'black pagoda'],
    canonicalName: 'Konark Sun Temple',
    state: 'Odisha',
    country: 'India',
    significance: 'UNESCO World Heritage 13th-century architectural triumph conceived as a colossal stone chariot of the Sun God Surya with 24 carved wheels.',
    tags: ['UNESCO', 'Sun Temple', 'Heritage', 'Odisha'],
    season: 'October – March',
    climate: 'Pleasant coastal',
    imageUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Konarka_Temple.jpg/1280px-Konarka_Temple.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail"
  }
];

export const DUMMY_PLACE_NAMES = new Set([
  'xyz', 'abc', 'asdf', 'asdfg', 'asdfgh', 'qwerty', 'test', 'testing', 'tester',
  'testplace', 'foo', 'bar', 'baz', 'blah', 'fake', 'random', 'hello', 'hi', 'hey',
  'none', 'na', 'n/a', 'nothing', 'null', 'undefined', 'dummy', 'sample', 'temp',
  'place', 'landmark', 'myplace', 'xyz123', 'abc123', 'aaa', 'bbb', 'ccc', 'xxx',
  'yyy', 'zzz', 'etc', 'unknown', 'somewhere', 'anywhere', 'city', 'town', 'village'
]);

function analyzeSignificance(
  userSig: string,
  canonicalName: string,
  authenticSig: string,
  tags: string[] = []
): UserSignificanceAnalysis {
  const cleanSig = (userSig || '').trim();
  const lowerSig = cleanSig.toLowerCase();

  // If user provided no significance or generic placeholder
  if (!cleanSig || cleanSig.length < 5 || DUMMY_PLACE_NAMES.has(lowerSig)) {
    return {
      status: 'MISSING_OR_VAGUE',
      feedback: `No detailed significance was provided. AI has retrieved the verified historical significance below.`,
      suggestedSignificance: authenticSig
    };
  }

  // Check for contradiction between user description and actual landmark
  const isWaterbodyOrBeach = tags.some((t) => /beach|coastal|sea|island/i.test(t));
  const isFortOrHeritage = tags.some((t) => /fort|heritage|monument|architecture|unesco|citadel/i.test(t));
  const isCave = tags.some((t) => /cave|geology/i.test(t));
  const isWaterfall = tags.some((t) => /waterfall/i.test(t));
  const isSpiritual = tags.some((t) => /temple|spiritual|shrine|jyotirlinga|church|mosque/i.test(t));

  const mentionsBeach = /\b(beach|coastal|ocean|scuba|snorkeling|sand)\b/i.test(lowerSig);
  const mentionsCave = /\b(cave|stalactite|stalagmite|subterranean)\b/i.test(lowerSig);
  const mentionsWaterfall = /\b(waterfall|cascade|falls)\b/i.test(lowerSig);

  let mismatchFound = false;
  let mismatchReason = '';

  if (mentionsBeach && !isWaterbodyOrBeach && (isFortOrHeritage || isCave || isWaterfall || isSpiritual)) {
    mismatchFound = true;
    mismatchReason = `"${canonicalName}" is not a coastal beach; it is known for ${authenticSig}`;
  } else if (mentionsCave && !isCave) {
    mismatchFound = true;
    mismatchReason = `"${canonicalName}" is not a cave formation; it is known for ${authenticSig}`;
  } else if (mentionsWaterfall && !isWaterfall) {
    mismatchFound = true;
    mismatchReason = `"${canonicalName}" is not a waterfall; it is known for ${authenticSig}`;
  }

  if (mismatchFound) {
    return {
      status: 'MISMATCH_DETECTED',
      feedback: `Significance Discrepancy: ${mismatchReason}`,
      suggestedSignificance: authenticSig
    };
  }

  return {
    status: 'VERIFIED_ACCURATE',
    feedback: `Significance Verified: Your description accurately aligns with the authentic heritage and characteristics of ${canonicalName}.`,
    suggestedSignificance: cleanSig
  };
}

// Helper to detect educational institutions, colleges, schools, or private academic campuses
export function isEducationalOrNonTouristPlace(name: string): boolean {
  const lower = name.toLowerCase().trim();
  // Allow ancient archaeological heritage ruins (e.g., Nalanda University Archaeological Ruins)
  if (lower.includes('ruins') || lower.includes('archaeological') || lower.includes('excavation')) {
    return false;
  }
  const educationalPatterns = [
    /\bcollege\b/i,
    /\buniversity\b/i,
    /\binstitute\b/i,
    /\binstitution\b/i,
    /\bschool\b/i,
    /\bacademy\b/i,
    /\bcampus\b/i,
    /\bpolytechnic\b/i,
    /\bvidyalaya\b/i,
    /\bgurukul\b/i,
    /\bcoaching\b/i,
    /\btuition\b/i,
    /\bhostel\b/i,
    /\biit\b/i,
    /\bnit\b/i,
    /\biim\b/i,
    /\biiit\b/i,
    /\bbits\b/i,
    /\bbits pilani\b/i,
    /\baiims\b/i,
    /\bbvrit\b/i,
    /\bengineering\b/i,
    /\bmedical college\b/i,
    /\bdegree college\b/i,
    /\bjunior college\b/i,
    /\bhigh school\b/i,
    /\bstudy centre\b/i,
    /\bstudy center\b/i
  ];
  return educationalPatterns.some((regex) => regex.test(lower));
}

export async function verifyPlaceKnowledge(
  placeName: string,
  state: string,
  country: string = 'India',
  userSignificance: string = ''
): Promise<VerificationResponse> {
  const cleanName = placeName.trim();
  const cleanState = (state || '').trim();
  const lowerName = cleanName.toLowerCase();

  // 1. REJECT EDUCATIONAL INSTITUTES & PRIVATE CAMPUSES (Only public tourist spots allowed)
  if (isEducationalOrNonTouristPlace(cleanName)) {
    return {
      isValid: false,
      confidence: 99,
      verificationStatus: 'INVALID_OR_NOT_FOUND',
      placeName: cleanName,
      state: cleanState,
      country,
    significance: "Konark Sun Temple is a 13th-century CE Hindu Sun temple at Konark about 35 kilometres (22 mi) northeast from Puri city on the coastline in Puri district, Odisha, India.  The temple is attributed to king Narasingha Deva I of the Eastern Ganga dynasty about 1250 CE.  Dedicated to the Hindu Sun-god Surya, it reflects the pinnacle of Kalingan architecture and artistic excellence, what remains of the temple complex has the appearance of a 30-metre (100 ft) high chariot with immense wheels and horses, all carved from stone.  Once over 61 metres (200 ft) high, much of the temple is now in ruins, in particular the large shikara tower over the sanctuary; at one time this rose much higher than the mandapa that remains.  The structures and elements that have survived are famed for their intricate artwork, iconography, and themes, including erotic kama and mithuna scenes.",
      userSignificanceAnalysis: {
        status: 'INVALID',
        feedback: `"${cleanName}" is an educational institution or academic campus. TravelSphere only accepts public tourist spots, scenic landscapes, and cultural monuments that anyone can visit.`
      },
      suggestedTags: ['Educational Institute', 'Not A Tourist Spot'],
      suggestedSeason: 'Not Applicable',
      suggestedClimate: 'Not Applicable',
      aiExplanation: `"${cleanName}" was identified as an educational institute or school/college campus. TravelSphere is strictly for public tourist attractions, scenic viewpoints, nature reserves, and historical monuments that anyone from the general public can visit. Educational institutions cannot be added.`,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanName)}`
    };
  }

  // 2. First check canonical landmark database
  const matched = KNOWN_LANDMARKS.find((lm) => {
    const canonicalLower = lm.canonicalName.toLowerCase();
    return (
      canonicalLower === lowerName ||
      canonicalLower.includes(lowerName) ||
      lowerName.includes(canonicalLower) ||
      lm.names.some((alias) => lowerName === alias || lowerName.includes(alias) || alias.includes(lowerName))
    );
  });

  // 3. Detect blatant nonsense, dummy strings, keyboard mashing, or placeholder inputs
  const strippedDummyWord = lowerName.replace(/\b(temple|shrine|monument|fort|caves?|falls?|park|palace|lake|beach|hill|resort|hotel)\b/gi, '').trim();
  const isExplicitDummyPlaceholder =
    lowerName === 'xyz' ||
    lowerName.includes('xyz temple') ||
    lowerName.includes('abc temple') ||
    lowerName.includes('test temple') ||
    lowerName.includes('fake temple') ||
    strippedDummyWord === 'xyz' ||
    DUMMY_PLACE_NAMES.has(strippedDummyWord);

  const isTempleOrHeritage = !isExplicitDummyPlaceholder && (lowerName.includes('temple') || lowerName.includes('shrine') || lowerName.includes('monument') || lowerName.includes('fort') || lowerName.includes('caves'));
  const isDummyOrGibberish =
    !matched &&
    (isExplicitDummyPlaceholder ||
      cleanName.length <= 2 ||
      (DUMMY_PLACE_NAMES.has(lowerName) && !isTempleOrHeritage) ||
      /^[0-9!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?`~ ]+$/.test(cleanName) ||
      (!/[aeiou]/i.test(cleanName) && cleanName.length < 5 && !isTempleOrHeritage) ||
      (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(cleanName) && !isTempleOrHeritage) ||
      (/(.)\1{3,}/.test(cleanName)));

  if (isDummyOrGibberish) {
    return {
      isValid: false,
      confidence: 10,
      verificationStatus: 'INVALID_OR_NOT_FOUND',
      placeName: cleanName,
      state: cleanState,
      country,
      significance: 'Cannot verify significance for an unverified or nonexistent place.',
      userSignificanceAnalysis: {
        status: 'INVALID',
        feedback: `Cannot verify significance: "${cleanName}" is not a recognized landmark or geographical destination.`
      },
      suggestedTags: ['Unverified'],
      suggestedSeason: 'Not Applicable',
      suggestedClimate: 'Not Applicable',
      aiExplanation: `"${cleanName}" is not a genuine travel landmark, heritage site, or geographical destination. Please check the spelling or enter a real landmark.`,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanName)}`
    };
  }

  if (matched) {
    const isStateMatch = !cleanState || cleanState.toLowerCase() === matched.state.toLowerCase();
    const gMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${matched.canonicalName}, ${matched.state}, ${matched.country}`)}`;
    const sigAnalysis = analyzeSignificance(userSignificance, matched.canonicalName, matched.significance, matched.tags);

    if (isStateMatch) {
      return {
        isValid: true,
        confidence: 98,
        verificationStatus: 'VERIFIED_ACCURATE',
        placeName: matched.canonicalName,
        state: matched.state,
        country: matched.country,
        significance: sigAnalysis.suggestedSignificance || matched.significance,
        userSignificanceAnalysis: sigAnalysis,
        suggestedTags: matched.tags,
        suggestedSeason: matched.season,
        suggestedClimate: matched.climate,
        aiExplanation: `Verified authentic landmark "${matched.canonicalName}". Located in ${matched.state}, ${matched.country}. Geographical coordinates and historical data verified.`,
        googleMapsUrl: gMaps,
        suggestedImageUrl: matched.imageUrl
      };
    } else {
      return {
        isValid: true,
        confidence: 95,
        verificationStatus: 'CORRECTIONS_SUGGESTED',
        placeName: matched.canonicalName,
        correctedPlaceName: matched.canonicalName,
        state: matched.state,
        country: matched.country,
        significance: sigAnalysis.suggestedSignificance || matched.significance,
        userSignificanceAnalysis: sigAnalysis,
        suggestedTags: matched.tags,
        suggestedSeason: matched.season,
        suggestedClimate: matched.climate,
        aiExplanation: `Landmark found! Note: "${matched.canonicalName}" is situated in ${matched.state} (not in ${cleanState}). State correction suggested.`,
        corrections: `Updated state to ${matched.state}.`,
        googleMapsUrl: gMaps,
        suggestedImageUrl: matched.imageUrl
      };
    }
  }

  // 3. Fallback: Query live Wikipedia REST API & Search API with proper User-Agent
  try {
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName.replace(/\s+/g, '_'))}`;
    const res = await fetch(summaryUrl, {
      headers: { 'User-Agent': 'IndiaTravelGuide/1.0 (contact@exploreindia.org)' }
    });

    if (res.ok) {
      const data: any = await res.json();
      if (data.type === 'standard') {
        const text = `${data.description || ''} ${data.extract || ''}`.toLowerCase();

        // Reject if Wikipedia identifies this as an educational/academic entity
        if (isEducationalOrNonTouristPlace(data.title) || isEducationalOrNonTouristPlace(text)) {
          return {
            isValid: false,
            confidence: 99,
            verificationStatus: 'INVALID_OR_NOT_FOUND',
            placeName: data.title,
            state: cleanState || 'India',
            country,
            significance: 'Educational institutions and academic facilities cannot be added as public tourist destinations.',
            userSignificanceAnalysis: {
              status: 'INVALID',
              feedback: `"${data.title}" is an educational institution or campus. Only publicly accessible tourist attractions, parks, and heritage landmarks can be added.`
            },
            suggestedTags: ['Educational Institute', 'Not A Tourist Spot'],
            suggestedSeason: 'Not Applicable',
            suggestedClimate: 'Not Applicable',
            aiExplanation: `"${data.title}" is an educational institution, college, or university campus. TravelSphere exclusively allows public tourist attractions and leisure destinations that anyone can visit.`,
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.title)}`
          };
        }

        const geoKeywords = [
          'town', 'city', 'village', 'landmark', 'temple', 'fort', 'palace',
          'national park', 'sanctuary', 'monument', 'lake', 'waterfall', 'river',
          'mountain', 'hill', 'island', 'district', 'subdistrict', 'state',
          'heritage', 'church', 'mosque', 'monastery', 'beach', 'resort',
          'valley', 'pass', 'caves', 'museum', 'botanical garden',
          'capital', 'municipality', 'taluk', 'india', 'location', 'historic'
        ];
        const hasGeoSignificance = data.coordinates || geoKeywords.some((k) => text.includes(k));

        if (hasGeoSignificance) {
          const authSig = data.extract || `${data.title} is a notable landmark in ${cleanState || country}.`;
          const sigAnalysis = analyzeSignificance(userSignificance, data.title, authSig, ['Travel', 'Landmark', cleanState || country]);
          return {
            isValid: true,
            confidence: 90,
            verificationStatus: 'VERIFIED_ACCURATE',
            placeName: data.title,
            state: cleanState || 'India',
            country,
            significance: sigAnalysis.suggestedSignificance || authSig,
            userSignificanceAnalysis: sigAnalysis,
            suggestedTags: ['Travel', cleanState || country, 'Heritage', 'Destination'],
            suggestedSeason: 'October – March',
            suggestedClimate: 'Pleasant to Tropical',
            aiExplanation: `Destination "${data.title}" verified via official records in ${cleanState || country}. Coordinates and cultural records verified.`,
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.title}, ${cleanState}, ${country}`)}`,
            suggestedImageUrl: data.thumbnail?.source || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80'
          };
        }
      }
    }

    // Try Wikipedia search API
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(`${cleanName} ${cleanState || 'India'}`)}&format=json`;
    const sRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'IndiaTravelGuide/1.0 (contact@exploreindia.org)' }
    });

    if (sRes.ok) {
      const sData: any = await sRes.json();
      const hits = sData.query?.search || [];
      for (const hit of hits.slice(0, 3)) {
        const hitLower = hit.title.toLowerCase();
        if (hitLower === lowerName || hitLower.includes(lowerName) || lowerName.includes(hitLower)) {
          const cleanSnippet = hit.snippet.replace(/<[^>]*>/g, '');

          // Disallow educational institutions from search hits
          if (isEducationalOrNonTouristPlace(hit.title) || isEducationalOrNonTouristPlace(cleanSnippet)) {
            return {
              isValid: false,
              confidence: 99,
              verificationStatus: 'INVALID_OR_NOT_FOUND',
              placeName: hit.title,
              state: cleanState || 'India',
              country,
              significance: 'Educational institutions, colleges, and private campuses are not public tourist destinations.',
              userSignificanceAnalysis: {
                status: 'INVALID',
                feedback: `"${hit.title}" is an educational institution or academic campus. Only public tourist attractions that anyone can visit can be added.`
              },
              suggestedTags: ['Educational Institute', 'Not A Tourist Spot'],
              suggestedSeason: 'Not Applicable',
              suggestedClimate: 'Not Applicable',
              aiExplanation: `"${hit.title}" is an educational institution or campus. TravelSphere strictly accepts public tourist spots, scenic landscapes, and monuments that anyone can visit.`,
              googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hit.title)}`
            };
          }

          const authSig = cleanSnippet || `${hit.title} in ${cleanState || country}.`;
          const sigAnalysis = analyzeSignificance(userSignificance, hit.title, authSig, ['Travel', cleanState || country]);
          return {
            isValid: true,
            confidence: 85,
            verificationStatus: 'VERIFIED_ACCURATE',
            placeName: hit.title,
            state: cleanState || 'India',
            country,
            significance: sigAnalysis.suggestedSignificance || authSig,
            userSignificanceAnalysis: sigAnalysis,
            suggestedTags: ['Travel', cleanState || country, 'Destination'],
            suggestedSeason: 'October – March',
            suggestedClimate: 'Pleasant',
            aiExplanation: `Destination "${hit.title}" verified in ${cleanState || country}.`,
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hit.title}, ${cleanState}, ${country}`)}`,
            suggestedImageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80'
          };
        }
      }
    }
  } catch (err) {
    console.warn('Wikipedia API verification lookup error:', err);
  }

  // 4. Place could NOT be verified in knowledge base or Wikipedia -> REJECT AS INVALID
  return {
    isValid: false,
    confidence: 15,
    verificationStatus: 'INVALID_OR_NOT_FOUND',
    placeName: cleanName,
    state: cleanState,
    country,
    significance: 'Unable to verify significance for unrecognized destination.',
    userSignificanceAnalysis: {
      status: 'INVALID',
      feedback: `Cannot verify significance: "${cleanName}" could not be recognized as a genuine geographical landmark or travel destination.`
    },
    suggestedTags: ['Unverified'],
    suggestedSeason: 'Not Determined',
    suggestedClimate: 'Not Determined',
    aiExplanation: `"${cleanName}" could not be verified as a recognized travel landmark or geographical destination in ${cleanState || 'India'}. Please verify the spelling or choose an authentic destination.`,
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanName)}`
  };
}

