'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Phone, Calendar, Edit, Save, X, Camera } from 'lucide-react'
import { getAssetUrl } from '@/lib/api-config'

// Location data
const locationData = {
  'Philippines': {
    provinces: [
      { name: 'Metro Manila', cities: ['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Marikina', 'Caloocan', 'Malabon', 'Navotas', 'Parañaque', 'Las Piñas', 'Muntinlupa', 'San Juan', 'Mandaluyong', 'Pasay', 'Pateros', 'Valenzuela'] },
      { name: 'Cebu', cities: ['Cebu City', 'Mandaue City', 'Lapu-Lapu City', 'Talisay City', 'Danao City', 'Toledo City', 'Naga City', 'Carcar City'] },
      { name: 'Davao', cities: ['Davao City', 'Digos City', 'Tagum City', 'Panabo City', 'Samal City'] },
      { name: 'Batangas', cities: ['Batangas City', 'Lipa City', 'Tanauan City', 'Santo Tomas', 'Calaca'] },
      { name: 'Pampanga', cities: ['Angeles City', 'San Fernando City', 'Mabalacat City', 'Mexico', 'Arayat'] },
      { name: 'Laguna', cities: ['Calamba', 'San Pablo', 'Santa Rosa', 'Biñan', 'Los Baños', 'San Pedro'] },
      { name: 'Cavite', cities: ['Dasmariñas', 'Bacoor', 'Imus', 'General Trias', 'Trece Martires', 'Tagaytay'] },
      { name: 'Rizal', cities: ['Antipolo', 'Taytay', 'Cainta', 'Angono', 'Binangonan', 'Rodriguez'] }
    ]
  },
  'United States': {
    provinces: [
      { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Oakland', 'Fresno', 'Long Beach', 'Bakersfield', 'Anaheim', 'Santa Ana', 'Riverside', 'Stockton', 'Irvine', 'Chula Vista'] },
      { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica'] },
      { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock', 'Laredo', 'Garland', 'Irving', 'Amarillo'] },
      { name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'Tallahassee', 'Hialeah', 'Port St. Lucie', 'Cape Coral', 'Pembroke Pines', 'Hollywood', 'Miramar', 'Gainesville'] },
      { name: 'Illinois', cities: ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield', 'Peoria', 'Elgin', 'Waukegan', 'Cicero'] },
      { name: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg', 'Altoona'] },
      { name: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown', 'Lorain'] },
      { name: 'Georgia', cities: ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens', 'Sandy Springs', 'Roswell', 'Macon', 'Albany', 'Johns Creek'] }
    ]
  },
  'Canada': {
    provinces: [
      { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London', 'Windsor', 'Kitchener', 'Markham', 'Vaughan', 'Richmond Hill', 'Burlington', 'Oshawa', 'Barrie'] },
      { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Saguenay', 'Lévis', 'Trois-Rivières', 'Terrebonne', 'Saint-Jean-sur-Richelieu', 'Repentigny'] },
      { name: 'British Columbia', cities: ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Abbotsford', 'Victoria', 'Coquitlam', 'Saanich', 'Delta', 'Kelowna', 'Langley', 'Kamloops', 'Nanaimo'] },
      { name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'St. Albert', 'Grande Prairie', 'Airdrie', 'Spruce Grove', 'Leduc', 'Fort McMurray'] },
      { name: 'Manitoba', cities: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie', 'Winkler', 'Selkirk', 'Morden', 'Flin Flon', 'The Pas'] },
      { name: 'Saskatchewan', cities: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current', 'Yorkton', 'North Battleford', 'Estevan', 'Weyburn', 'Cranbrook'] }
    ]
  },
  'United Kingdom': {
    provinces: [
      { name: 'England', cities: ['London', 'Birmingham', 'Manchester', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 'Newcastle', 'Nottingham', 'Leicester', 'Coventry', 'Bradford', 'Stoke-on-Trent', 'Wolverhampton', 'Plymouth'] },
      { name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Paisley', 'East Kilbride', 'Livingston', 'Hamilton', 'Cumbernauld', 'Kirkcaldy', 'Dunfermline', 'Ayr', 'Perth', 'Inverness'] },
      { name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry', 'Caerphilly', 'Rhondda', 'Port Talbot', 'Bridgend', 'Llanelli', 'Merthyr Tydfil', 'Cwmbran', 'Aberdare', 'Colwyn Bay'] },
      { name: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn', 'Newtownabbey', 'Bangor', 'Craigavon', 'Castlereagh', 'Antrim', 'Newry', 'Carrickfergus', 'Newtownards', 'Coleraine', 'Omagh', 'Larne'] }
    ]
  },
  'Australia': {
    provinces: [
      { name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Maitland', 'Albury', 'Wagga Wagga', 'Tamworth', 'Orange', 'Dubbo', 'Nowra', 'Bathurst', 'Lismore', 'Bowral', 'Grafton'] },
      { name: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton', 'Warrnambool', 'Mildura', 'Traralgon', 'Melton', 'Sunbury', 'Echuca', 'Wodonga', 'Colac', 'Hamilton'] },
      { name: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Townsville', 'Cairns', 'Toowoomba', 'Rockhampton', 'Mackay', 'Bundaberg', 'Hervey Bay', 'Gladstone', 'Mount Isa', 'Maryborough', 'Gympie', 'Warwick'] },
      { name: 'Western Australia', cities: ['Perth', 'Fremantle', 'Rockingham', 'Mandurah', 'Bunbury', 'Geraldton', 'Kalgoorlie', 'Albany', 'Broome', 'Port Hedland', 'Karratha', 'Newman', 'Esperance', 'Kununurra'] },
      { name: 'South Australia', cities: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Murray Bridge', 'Port Augusta', 'Port Pirie', 'Port Lincoln', 'Kadina', 'Berri', 'Roxby Downs', 'Naracoorte', 'Millicent', 'Gawler', 'Victor Harbor'] },
      { name: 'Tasmania', cities: ['Hobart', 'Launceston', 'Devonport', 'Burnie', 'Ulverstone', 'George Town', 'Kingston', 'New Norfolk', 'Scottsdale', 'Queenstown', 'Smithton', 'Wynyard', 'Penguin', 'Sheffield'] }
    ]
  },
  'Germany': {
    provinces: [
      { name: 'Bavaria', cities: ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg', 'Würzburg', 'Ingolstadt', 'Fürth', 'Erlangen', 'Bayreuth', 'Bamberg', 'Aschaffenburg', 'Landshut', 'Kempten', 'Rosenheim'] },
      { name: 'North Rhine-Westphalia', cities: ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster', 'Gelsenkirchen', 'Mönchengladbach', 'Aachen', 'Krefeld'] },
      { name: 'Baden-Württemberg', cities: ['Stuttgart', 'Mannheim', 'Karlsruhe', 'Freiburg', 'Heidelberg', 'Heilbronn', 'Ulm', 'Pforzheim', 'Reutlingen', 'Tübingen', 'Konstanz', 'Villingen-Schwenningen', 'Esslingen', 'Ludwigsburg'] },
      { name: 'Lower Saxony', cities: ['Hanover', 'Braunschweig', 'Osnabrück', 'Oldenburg', 'Göttingen', 'Hildesheim', 'Salzgitter', 'Wolfsburg', 'Emden', 'Delmenhorst', 'Wilhelmshaven', 'Celle', 'Peine', 'Goslar'] },
      { name: 'Hesse', cities: ['Frankfurt', 'Wiesbaden', 'Kassel', 'Darmstadt', 'Offenbach', 'Fulda', 'Gießen', 'Marburg', 'Rüsselsheim', 'Hanau', 'Wetzlar', 'Bad Homburg', 'Rodgau', 'Oberursel'] }
    ]
  },
  'France': {
    provinces: [
      { name: 'Île-de-France', cities: ['Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Argenteuil', 'Montreuil', 'Créteil', 'Nanterre', 'Vitry-sur-Seine', 'Colombes', 'Aulnay-sous-Bois', 'Rueil-Malmaison', 'Saint-Maur-des-Fossés', 'Champigny-sur-Marne', 'Aubervilliers'] },
      { name: 'Auvergne-Rhône-Alpes', cities: ['Lyon', 'Saint-Étienne', 'Grenoble', 'Villeurbanne', 'Valence', 'Annecy', 'Chambéry', 'Clermont-Ferrand', 'Vénissieux', 'Saint-Priest', 'Vaulx-en-Velin', 'Caluire-et-Cuire', 'Bron', 'Rillieux-la-Pape'] },
      { name: 'Provence-Alpes-Côte d\'Azur', cities: ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence', 'Avignon', 'Cannes', 'Antibes', 'La Seyne-sur-Mer', 'Hyères', 'Fréjus', 'Grasse', 'Draguignan', 'Carpentras', 'Aubagne'] },
      { name: 'Occitanie', cities: ['Toulouse', 'Montpellier', 'Nîmes', 'Perpignan', 'Béziers', 'Montauban', 'Albi', 'Carcassonne', 'Narbonne', 'Sète', 'Lunel', 'Agde', 'Mazamet', 'Castres'] },
      { name: 'Nouvelle-Aquitaine', cities: ['Bordeaux', 'Limoges', 'Poitiers', 'La Rochelle', 'Angoulême', 'Bayonne', 'Pau', 'Agen', 'Brive-la-Gaillarde', 'Niort', 'Bergerac', 'Périgueux', 'Mont-de-Marsan', 'Dax'] }
    ]
  },
  'Japan': {
    provinces: [
      { name: 'Tokyo', cities: ['Tokyo', 'Shibuya', 'Shinjuku', 'Shibuya', 'Chiyoda', 'Chuo', 'Minato', 'Taito', 'Sumida', 'Koto', 'Shinagawa', 'Meguro', 'Ota', 'Setagaya', 'Nakano'] },
      { name: 'Osaka', cities: ['Osaka', 'Sakai', 'Higashiosaka', 'Toyonaka', 'Takatsuki', 'Hirakata', 'Suita', 'Yao', 'Ibaraki', 'Neyagawa', 'Kishiwada', 'Izumi', 'Tondabayashi', 'Kadoma', 'Moriguchi'] },
      { name: 'Kanagawa', cities: ['Yokohama', 'Kawasaki', 'Sagamihara', 'Yokosuka', 'Fujisawa', 'Chigasaki', 'Atsugi', 'Yamato', 'Odawara', 'Kamakura', 'Zama', 'Miura', 'Ebina', 'Ayase', 'Hiratsuka'] },
      { name: 'Aichi', cities: ['Nagoya', 'Toyota', 'Toyohashi', 'Okazaki', 'Ichinomiya', 'Kasugai', 'Anjo', 'Kariya', 'Komaki', 'Inazawa', 'Seto', 'Handa', 'Tokai', 'Obu', 'Toyoake'] },
      { name: 'Hyogo', cities: ['Kobe', 'Himeji', 'Nishinomiya', 'Amagasaki', 'Ashiya', 'Itami', 'Kakogawa', 'Takarazuka', 'Akashi', 'Sanda', 'Takarazuka', 'Miki', 'Kawanishi', 'Tatsuno', 'Aioi'] }
    ]
  },
  'India': {
    provinces: [
      { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Sangli', 'Malegaon', 'Jalgaon', 'Akola', 'Latur', 'Ahmadnagar'] },
      { name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga', 'Tumkur', 'Raichur', 'Bidar', 'Hospet', 'Gadag'] },
      { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukkudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur'] },
      { name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Nadiad', 'Morbi', 'Surendranagar', 'Bharuch', 'Anand', 'Palanpur', 'Valsad'] },
      { name: 'Delhi', cities: ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'North East Delhi', 'North West Delhi', 'South West Delhi', 'Shahdara', 'New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi'] }
    ]
  },
  'Singapore': {
    provinces: [
      { name: 'Central Region', cities: ['Singapore', 'Marina Bay', 'Orchard', 'Raffles Place', 'Clarke Quay', 'Chinatown', 'Little India', 'Bugis', 'Dhoby Ghaut', 'City Hall', 'Esplanade', 'Bras Basah', 'Rochor', 'Kallang', 'Geylang'] },
      { name: 'East Region', cities: ['Tampines', 'Pasir Ris', 'Bedok', 'Changi', 'Simei', 'Eunos', 'Kembangan', 'Paya Lebar', 'Aljunied', 'MacPherson', 'Kallang', 'Geylang', 'Marine Parade', 'Katong', 'Joo Chiat'] },
      { name: 'North Region', cities: ['Woodlands', 'Sembawang', 'Yishun', 'Ang Mo Kio', 'Seletar', 'Punggol', 'Sengkang', 'Hougang', 'Serangoon', 'Bishan', 'Toa Payoh', 'Braddell', 'Lorong Chuan', 'Marymount', 'Bishan'] },
      { name: 'North East Region', cities: ['Sengkang', 'Punggol', 'Hougang', 'Serangoon', 'Ang Mo Kio', 'Bishan', 'Toa Payoh', 'Braddell', 'Lorong Chuan', 'Marymount', 'Bishan', 'Toa Payoh', 'Braddell', 'Lorong Chuan', 'Marymount'] },
      { name: 'West Region', cities: ['Jurong', 'Boon Lay', 'Pioneer', 'Joo Koon', 'Gul Circle', 'Tuas', 'Clementi', 'Dover', 'Buona Vista', 'Holland Village', 'Queenstown', 'Redhill', 'Tiong Bahru', 'Outram Park', 'Tanjong Pagar'] }
    ]
  },
  'Malaysia': {
    provinces: [
      { name: 'Selangor', cities: ['Kuala Lumpur', 'Shah Alam', 'Petaling Jaya', 'Subang Jaya', 'Klang', 'Ampang', 'Kajang', 'Selayang', 'Rawang', 'Semenyih', 'Banting', 'Kuala Selangor', 'Sabak Bernam', 'Hulu Selangor', 'Gombak'] },
      { name: 'Johor', cities: ['Johor Bahru', 'Kluang', 'Batu Pahat', 'Muar', 'Kulai', 'Segamat', 'Pontian', 'Kota Tinggi', 'Mersing', 'Tangkak', 'Labis', 'Yong Peng', 'Parit Raja', 'Ayer Hitam', 'Simpang Renggam'] },
      { name: 'Penang', cities: ['George Town', 'Butterworth', 'Bukit Mertajam', 'Nibong Tebal', 'Bayan Lepas', 'Tanjung Bungah', 'Batu Ferringhi', 'Gelugor', 'Air Itam', 'Pulau Tikus', 'Tanjung Tokong', 'Batu Maung', 'Bayan Baru', 'Sungai Dua', 'Sungai Nibong'] },
      { name: 'Perak', cities: ['Ipoh', 'Taiping', 'Sitiawan', 'Teluk Intan', 'Kuala Kangsar', 'Lumut', 'Kampar', 'Batu Gajah', 'Simpang Pulai', 'Tanjung Malim', 'Parit Buntar', 'Bagan Serai', 'Kuala Kurau', 'Bagan Datoh', 'Hilir Perak'] },
      { name: 'Sabah', cities: ['Kota Kinabalu', 'Sandakan', 'Tawau', 'Lahad Datu', 'Keningau', 'Kudat', 'Semporna', 'Beaufort', 'Papar', 'Kota Belud', 'Tuaran', 'Ranau', 'Tambunan', 'Tenom', 'Pensiangan'] }
    ]
  },
  'Indonesia': {
    provinces: [
      { name: 'Jakarta', cities: ['Jakarta', 'Central Jakarta', 'North Jakarta', 'South Jakarta', 'East Jakarta', 'West Jakarta', 'Thousand Islands', 'Kepulauan Seribu', 'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat', 'Kepulauan Seribu', 'Jakarta'] },
      { name: 'West Java', cities: ['Bandung', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Cirebon', 'Sukabumi', 'Cianjur', 'Karawang', 'Purwakarta', 'Subang', 'Indramayu', 'Sumedang', 'Majalengka', 'Kuningan'] },
      { name: 'East Java', cities: ['Surabaya', 'Malang', 'Kediri', 'Blitar', 'Mojokerto', 'Pasuruan', 'Probolinggo', 'Lumajang', 'Jember', 'Banyuwangi', 'Bondowoso', 'Situbondo', 'Tuban', 'Lamongan', 'Gresik'] },
      { name: 'Central Java', cities: ['Semarang', 'Surakarta', 'Salatiga', 'Magelang', 'Pekalongan', 'Tegal', 'Cilacap', 'Banyumas', 'Purbalingga', 'Banjarnegara', 'Kebumen', 'Purworejo', 'Wonosobo', 'Temanggung', 'Kendal'] },
      { name: 'Banten', cities: ['Serang', 'Tangerang', 'Cilegon', 'Lebak', 'Pandeglang', 'Rangkasbitung', 'Curug', 'Balaraja', 'Cikupa', 'Cisauk', 'Cisoka', 'Cikande', 'Kibin', 'Malingping', 'Bayah'] }
    ]
  },
  'Thailand': {
    provinces: [
      { name: 'Bangkok', cities: ['Bangkok', 'Chatuchak', 'Bang Sue', 'Dusit', 'Phaya Thai', 'Ratchathewi', 'Sathon', 'Bang Rak', 'Khlong Toei', 'Watthana', 'Bangkok Noi', 'Bangkok Yai', 'Thon Buri', 'Khlong San', 'Rat Burana'] },
      { name: 'Chiang Mai', cities: ['Chiang Mai', 'Mae Rim', 'Mae Taeng', 'Chom Thong', 'Doi Tao', 'Hot', 'Om Koi', 'Samoeng', 'San Pa Tong', 'San Kamphaeng', 'Sankampaeng', 'Saraphi', 'Wiang Haeng', 'Mae Chaem', 'Mae On'] },
      { name: 'Phuket', cities: ['Phuket', 'Kathu', 'Thalang', 'Mueang Phuket', 'Rawai', 'Chalong', 'Karon', 'Patong', 'Kamala', 'Surin', 'Bang Tao', 'Nai Harn', 'Kata', 'Kata Noi', 'Nai Thon'] },
      { name: 'Pattaya', cities: ['Pattaya', 'Bang Lamung', 'Sattahip', 'Si Racha', 'Ban Bueng', 'Phanat Nikhom', 'Ko Chan', 'Nong Yai', 'Phan Thong', 'Chon Buri', 'Mueang Chon Buri', 'Bang Saen', 'Bang Phra', 'Ko Sichang', 'Ko Loi'] },
      { name: 'Krabi', cities: ['Krabi', 'Ao Nang', 'Railay', 'Phi Phi', 'Ko Lanta', 'Ko Yao', 'Ko Poda', 'Ko Hong', 'Ko Poda', 'Ko Poda', 'Ko Poda', 'Ko Poda', 'Ko Poda', 'Ko Poda', 'Ko Poda'] }
    ]
  }
}

// Job categories
const jobCategories = [
  'Customer Service',
  'Information Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Marketing',
  'Sales',
  'Engineering',
  'Design',
  'Human Resources',
  'Legal',
  'Manufacturing',
  'Retail',
  'Hospitality',
  'Transportation',
  'Construction',
  'Agriculture',
  'Media & Entertainment',
  'Non-Profit',
  'Other'
]

// Experience levels
const experienceLevels = [
  'Entry Level (0-2 years)',
  'Junior (2-4 years)',
  'Mid-Level (4-7 years)',
  'Senior (7-10 years)',
  'Lead (10-15 years)',
  'Manager (15+ years)',
  'Director/Executive (15+ years)'
]

export default function PersonalInformation() {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || ''
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: 'Philippines',
    province: '',
    city: '',
    dateOfBirth: '',
    gender: 'male',
    jobCategory: 'Customer Service',
    yourTitle: '',
    experience: 'Entry Level (0-2 years)',
    avatar: '/placeholder.svg?height=100&width=100'
  })

  const [availableProvinces, setAvailableProvinces] = useState<Array<{name: string, cities: string[]}>>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])

  // Load personal information from backend
  useEffect(() => {
    const loadPersonalInfo = async () => {
      try {
        const jobseekerId = localStorage.getItem('jobseeker_id')
        if (!jobseekerId) return setLoading(false)
        const res = await fetch(`/api/seeker/profile/get_personal_info?jobseeker_id=${jobseekerId}`)
        const data = await res.json()
        if (data.success && data.data) {
          setFormData({
            firstName: data.data.first_name || '',
            lastName: data.data.last_name || '',
            email: data.data.email || '',
            phone: data.data.phone || '',
            nationality: data.data.nationality || 'Philippines',
            province: data.data.province || '',
            city: data.data.city || '',
            dateOfBirth: (data.data.date_of_birth && data.data.date_of_birth !== '0000-00-00') ? data.data.date_of_birth : '',
            gender: data.data.gender || 'male',
            jobCategory: data.data.job_category || 'Customer Service',
            yourTitle: data.data.your_title || '',
            experience: data.data.experience_level || 'Entry Level (0-2 years)',
            avatar: data.data.avatar ? getAssetUrl(data.data.avatar) : '/placeholder.svg?height=100&width=100'
          })
          // Pre-populate provinces and cities based on API values so the selects have matching options
          const nat = data.data.nationality || 'Philippines'
          if (nat && (locationData as any)[nat]) {
            const provinces = (locationData as any)[nat].provinces as Array<{ name: string; cities: string[] }>
            setAvailableProvinces(provinces)
            const prov = data.data.province || ''
            const selectedProvince = provinces.find(p => p.name === prov)
            if (selectedProvince) {
              setAvailableCities(selectedProvince.cities)
            } else {
              setAvailableCities([])
            }
          } else {
            setAvailableProvinces([])
            setAvailableCities([])
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadPersonalInfo()
  }, [])

  // Update provinces when nationality changes
  useEffect(() => {
    if (formData.nationality && locationData[formData.nationality as keyof typeof locationData]) {
      const provinces = locationData[formData.nationality as keyof typeof locationData].provinces
      setAvailableProvinces(provinces)
      setFormData(prev => {
        const provinceIsValid = provinces.some(p => p.name === prev.province)
        const nextProvince = provinceIsValid ? prev.province : ''
        const cities = provinceIsValid ? (provinces.find(p => p.name === prev.province)?.cities || []) : []
        const cityIsValid = provinceIsValid && cities.includes(prev.city)
        return { ...prev, province: nextProvince, city: cityIsValid ? prev.city : '' }
      })
    } else {
      setAvailableProvinces([])
    }
  }, [formData.nationality])

  // Update cities when province changes
  useEffect(() => {
    if (formData.province) {
      const selectedProvince = availableProvinces.find(p => p.name === formData.province)
      if (selectedProvince) {
        setAvailableCities(selectedProvince.cities)
        if (!selectedProvince.cities.includes(formData.city)) {
          setFormData(prev => ({ ...prev, city: '' }))
        }
      } else {
        setAvailableCities([])
        if (formData.city) setFormData(prev => ({ ...prev, city: '' }))
      }
    } else {
      setAvailableCities([])
    }
  }, [formData.province, availableProvinces])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      try { (window as any).ProfileSave?.start('Saving personal information...') } catch {}
      const jobseekerId = localStorage.getItem('jobseeker_id')
      if (!jobseekerId) return
      const res = await fetch('/api/seeker/profile/update_personal_info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobseeker_id: jobseekerId,
          ...formData,
          // Ensure backend gets snake_case DOB field
          date_of_birth: formData.dateOfBirth || '',
          // Also send 'dob' because backend maps this key to date_of_birth
          dob: formData.dateOfBirth || '',
          // Backend expects snake_case for these fields
          job_category: formData.jobCategory,
          experience_level: formData.experience,
          your_title: formData.yourTitle
        })
      })
      const data = await res.json()
      if (data.success) {
        setIsEditing(false)
        try { (window as any).ProfileSave?.success('Personal information saved.') } catch {}
      } else {
        console.error(data.message)
        try { (window as any).ProfileSave?.error(data.message || 'Failed to save personal information.') } catch {}
      }
    } catch (error) {
      console.error(error)
      try { (window as any).ProfileSave?.error('Failed to save personal information.') } catch {}
    }
  }
  
  const onClickAvatarButton = () => {
    setAvatarMessage(null)
    const input = document.getElementById('avatar_upload') as HTMLInputElement | null
    input?.click()
  }

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarMessage(null)
    const file = e.target.files?.[0]
    if (!file) return
    const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    const isValidSize = file.size <= 2 * 1024 * 1024
    if (!isValidType) {
      setAvatarMessage('Invalid file type. Upload JPG, PNG, or WEBP.')
      return
    }
    if (!isValidSize) {
      setAvatarMessage('File too large. Max 2MB.')
      return
    }

    // Optimistic preview
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)

    // Upload
    try {
      try { (window as any).ProfileSave?.start('Uploading profile photo...') } catch {}
      setIsUploadingAvatar(true)
      const jobseekerId = localStorage.getItem('jobseeker_id')
      if (!jobseekerId) {
        setAvatarMessage('Please login again to upload your photo.')
        return
      }
      const form = new FormData()
      form.append('jobseeker_id', jobseekerId)
      form.append('profile_photo', file)
      const res = await fetch('/api/seeker/profile/upload_photo', { method: 'POST', body: form })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json?.success) {
        setAvatarMessage(json?.message || 'Upload failed. Please try again.')
        try { (window as any).ProfileSave?.error(json?.message || 'Upload failed. Please try again.') } catch {}
        return
      }
      const url: string | null = json?.data?.url || null
      if (url) {
        setFormData(prev => ({ ...prev, avatar: url }))
        localStorage.setItem('jobseeker_profile_photo_url', url)
        setAvatarMessage('Profile photo updated successfully.')
        try { (window as any).ProfileSave?.success('Profile photo updated.') } catch {}
      }
    } catch (err) {
      setAvatarMessage('Unexpected error during upload.')
      try { (window as any).ProfileSave?.error('Unexpected error during upload.') } catch {}
    } finally {
      setIsUploadingAvatar(false)
      // Reset the input value to allow re-selecting the same file
      const input = document.getElementById('avatar_upload') as HTMLInputElement | null
      if (input) input.value = ''
    }
  }

  const handleCancel = () => setIsEditing(false)

  return (
    <Card className="border-emerald-200 shadow-lg max-w-5xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-emerald-600" />
            <div>
              <CardTitle className="text-emerald-800 text-lg md:text-xl">Personal Information</CardTitle>
              <CardDescription className="text-emerald-600 text-sm md:text-base">
                Your basic profile information
              </CardDescription>
            </div>
          </div>
          <Button
            variant={isEditing ? "destructive" : "outline"}
            size="sm"
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            className={isEditing ? "border-red-300 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700" : "border-emerald-300 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700"
}
          >
            {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-emerald-500/20">
              <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={`${formData.firstName} ${formData.lastName}`} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-green-500 text-white text-xl">
                {formData.firstName[0]}{formData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                size="sm"
                onClick={onClickAvatarButton}
                disabled={isUploadingAvatar}
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-emerald-600 hover:bg-emerald-700 p-0 disabled:opacity-70"
              >
                <Camera className="h-4 w-4" />
              </Button>
            )}
            <input id="avatar_upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarFileChange} aria-label="Upload profile photo" title="Upload profile photo" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="text-gray-600 text-sm md:text-base">{formData.email}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{formData.jobCategory}</Badge>
              <Badge variant="outline" className="border-emerald-200 text-emerald-700">{formData.yourTitle}</Badge>
            </div>
            {avatarMessage && (
              <p className={`text-sm mt-2 ${avatarMessage.includes('successfully') ? 'text-emerald-600' : 'text-red-600'}`}>{avatarMessage}</p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
            />
          </div>

          {/* Email */}
          <div className="space-y-2 relative">
            <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className={`pl-10 ${isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}`}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2 relative">
            <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className={`pl-10 ${isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}`}
              />
            </div>
          </div>

          {/* Job Category */}
          <div className="space-y-2">
            <Label htmlFor="jobCategory" className="text-gray-700 font-medium">Job Category</Label>
            <Select value={formData.jobCategory} onValueChange={(val) => handleInputChange('jobCategory', val)} disabled={!isEditing}>
              <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Your Title */}
          <div className="space-y-2">
            <Label htmlFor="yourTitle" className="text-gray-700 font-medium">Your Title</Label>
            <Input
              id="yourTitle"
              value={formData.yourTitle}
              onChange={(e) => handleInputChange('yourTitle', e.target.value)}
              disabled={!isEditing}
              placeholder="e.g., Senior Software Developer"
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-gray-700 font-medium">Experience Level</Label>
            <Select value={formData.experience} onValueChange={(val) => handleInputChange('experience', val)} disabled={!isEditing}>
              <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label htmlFor="nationality" className="text-gray-700 font-medium">Nationality</Label>
            <Select value={formData.nationality} onValueChange={(val) => handleInputChange('nationality', val)} disabled={!isEditing}>
              <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(locationData).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Province */}
          <div className="space-y-2">
            <Label htmlFor="province" className="text-gray-700 font-medium">Province/State</Label>
            <Select value={formData.province} onValueChange={(val) => handleInputChange('province', val)} disabled={!isEditing || !availableProvinces.length}>
              <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                <SelectValue placeholder="Select province/state" />
              </SelectTrigger>
              <SelectContent>
                {availableProvinces.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-gray-700 font-medium">City</Label>
            <Select value={formData.city} onValueChange={(val) => handleInputChange('city', val)} disabled={!isEditing || !availableCities.length}>
              <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {availableCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-gray-700 font-medium">Gender</Label>
            <Select value={formData.gender} onValueChange={(val) => handleInputChange('gender', val)} disabled={!isEditing}>
              <SelectTrigger className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bio removed */}
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3 mt-4">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}