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
      { name: 'Cebu', cities: ['Cebu City', 'Mandaue City', 'Lapu-Lapu City', 'Talisay City', 'Danao City', 'Toledo City', 'Naga City', 'Carcar City', 'Bogo City', 'Minglanilla', 'Consolacion', 'Liloan', 'Compostela', 'Cordova'] },
      { name: 'Davao del Sur', cities: ['Davao City', 'Digos City', 'Santa Cruz', 'Bansalan', 'Matanao', 'Hagonoy', 'Kiblawan', 'Magsaysay', 'Padada', 'Sulop'] },
      { name: 'Batangas', cities: ['Batangas City', 'Lipa City', 'Tanauan City', 'Santo Tomas', 'Calaca', 'Nasugbu', 'Bauan', 'Balayan', 'Cuenca', 'San Juan', 'Lian', 'Taal', 'Lemery', 'Ibaan'] },
      { name: 'Pampanga', cities: ['Angeles City', 'San Fernando City', 'Mabalacat City', 'Mexico', 'Arayat', 'Apalit', 'Bacolor', 'Candaba', 'Floridablanca', 'Guagua', 'Lubao', 'Magalang', 'Masantol', 'Porac'] },
      { name: 'Bulacan', cities: ['Malolos City', 'Meycauayan City', 'San Jose del Monte City', 'Santa Maria', 'Marilao', 'Bocaue', 'Guiguinto', 'Balagtas', 'Plaridel', 'Pulilan', 'Calumpit', 'Hagonoy', 'Paombong', 'Bulakan'] },
      { name: 'Cavite', cities: ['Dasmariñas City', 'Bacoor City', 'Imus City', 'General Trias City', 'Trece Martires City', 'Tagaytay City', 'Kawit', 'Silang', 'Naic', 'Tanza', 'Rosario', 'Carmona', 'Gen. Mariano Alvarez', 'Amadeo'] },
      { name: 'Laguna', cities: ['Calamba City', 'Santa Rosa City', 'San Pablo City', 'Biñan City', 'Cabuyao City', 'San Pedro City', 'Los Baños', 'Santa Cruz', 'Magdalena', 'Pagsanjan', 'Liliw', 'Nagcarlan', 'Victoria', 'Bay'] },
      { name: 'Rizal', cities: ['Antipolo City', 'Taytay', 'Cainta', 'Binangonan', 'Angono', 'Rodriguez', 'San Mateo', 'Baras', 'Tanay', 'Morong', 'Jalajala', 'Pililla', 'Cardona'] },
      { name: 'Pangasinan', cities: ['Dagupan City', 'San Carlos City', 'Urdaneta City', 'Alaminos City', 'Lingayen', 'Mangaldan', 'Binmaley', 'Calasiao', 'Manaoag', 'Bayambang', 'Malasiqui', 'Santa Barbara', 'Mapandan', 'Sison'] },
      { name: 'Iloilo', cities: ['Iloilo City', 'Passi City', 'Santa Barbara', 'Cabtatuan', 'Pototan', 'Miagao', 'Tigbauan', 'Oton', 'Barotac Nuevo', 'Dingle', 'Dueñas', 'San Miguel', 'Guimbal', 'Leganes'] },
      { name: 'Negros Occidental', cities: ['Bacolod City', 'Bago City', 'Cadiz City', 'Escalante City', 'Himamaylan City', 'Kabankalan City', 'La Carlota City', 'Sagay City', 'San Carlos City', 'Silay City', 'Talisay City', 'Victorias City', 'Sipalay City', 'Manapla'] },
      { name: 'Bohol', cities: ['Tagbilaran City', 'Dauis', 'Panglao', 'Carmen', 'Guindulman', 'Jagna', 'Loon', 'Mabini', 'Talibon', 'Tubigon', 'Ubay', 'Valencia', 'Baclayon', 'Cortes'] },
      { name: 'Albay', cities: ['Legazpi City', 'Ligao City', 'Tabaco City', 'Daraga', 'Camalig', 'Guinobatan', 'Polangui', 'Malilipot', 'Sto. Domingo', 'Rapu-Rapu', 'Jovellar', 'Libon', 'Oas', 'Pio Duran'] },
      { name: 'Cagayan', cities: ['Tuguegarao City', 'Aparri', 'Gonzaga', 'Lal-lo', 'Solana', 'Iguig', 'Peñablanca', 'Amulung', 'Claveria', 'Abulug', 'Sta. Ana', 'Buguey', 'Ballesteros', 'Alcala'] }
    ]
  },
  
    'United States': {
      provinces: [
        { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose', 'Oakland', 'Fresno', 'Long Beach', 'Bakersfield', 'Anaheim', 'Santa Barbara', 'Riverside', 'Berkeley', 'Palo Alto', 'Santa Monica'] },
        { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon', 'Schenectady', 'Utica', 'White Plains', 'Troy', 'Binghamton', 'Ithaca', 'Poughkeepsie'] },
        { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock', 'Amarillo', 'Laredo', 'Irving', 'Garland', 'McKinney'] },
        { name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'Tallahassee', 'Hialeah', 'Port St. Lucie', 'Cape Coral', 'Pembroke Pines', 'St. Petersburg', 'Hollywood', 'Gainesville', 'Clearwater', 'Coral Springs'] },
        { name: 'Illinois', cities: ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield', 'Peoria', 'Elgin', 'Waukegan', 'Cicero', 'Champaign', 'Bloomington', 'Decatur', 'Arlington Heights', 'Evanston'] },
        { name: 'Washington', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Kent', 'Everett', 'Renton', 'Federal Way', 'Yakima', 'Bellingham', 'Kirkland', 'Redmond', 'Olympia', 'Richland'] },
        { name: 'Colorado', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood', 'Thornton', 'Arvada', 'Westminster', 'Pueblo', 'Centennial', 'Boulder', 'Greeley', 'Longmont', 'Loveland', 'Grand Junction'] },
        { name: 'Arizona', cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Glendale', 'Scottsdale', 'Gilbert', 'Tempe', 'Peoria', 'Surprise', 'Yuma', 'Avondale', 'Flagstaff', 'Goodyear', 'Lake Havasu City'] },
        { name: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton', 'Bethlehem', 'Lancaster', 'Harrisburg', 'York', 'Altoona', 'Wilkes-Barre', 'Chester', 'State College', 'Williamsport'] },
        { name: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton', 'Youngstown', 'Lorain', 'Hamilton', 'Springfield', 'Elyria', 'Mentor', 'Cleveland Heights'] },
        { name: 'Georgia', cities: ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah', 'Athens', 'Sandy Springs', 'Roswell', 'Johns Creek', 'Albany', 'Warner Robins', 'Alpharetta', 'Marietta', 'Valdosta', 'Smyrna'] },
        { name: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor', 'Lansing', 'Flint', 'Dearborn', 'Livonia', 'Troy', 'Westland', 'Farmington Hills', 'Kalamazoo', 'Wyoming', 'Rochester Hills'] },
        { name: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem', 'Fayetteville', 'Cary', 'Wilmington', 'High Point', 'Greenville', 'Asheville', 'Concord', 'Gastonia', 'Jacksonville', 'Chapel Hill'] },
        { name: 'Massachusetts', cities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell', 'Brockton', 'Quincy', 'Lynn', 'New Bedford', 'Fall River', 'Newton', 'Somerville', 'Lawrence', 'Framingham', 'Haverhill'] },
        { name: 'Nevada', cities: ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks', 'Carson City', 'Elko', 'Mesquite', 'Boulder City', 'Fernley', 'Winnemucca', 'Fallon', 'Lovelock', 'Yerington', 'Wells'] }
      ]
    },
    
      'Canada': {
        provinces: [
          { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Brampton', 'Hamilton', 'London', 'Windsor', 'Kitchener', 'Markham', 'Vaughan', 'Burlington', 'Oakville', 'Richmond Hill', 'Sudbury', 'Thunder Bay'] },
          { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil', 'Sherbrooke', 'Saguenay', 'Lévis', 'Trois-Rivières', 'Terrebonne', 'Drummondville', 'Saint-Jean-sur-Richelieu', 'Repentigny', 'Brossard', 'Dollard-des-Ormeaux'] },
          { name: 'British Columbia', cities: ['Vancouver', 'Surrey', 'Burnaby', 'Richmond', 'Abbotsford', 'Victoria', 'Coquitlam', 'Saanich', 'Delta', 'Kelowna', 'Nanaimo', 'Kamloops', 'Prince George', 'Chilliwack', 'Maple Ridge'] },
          { name: 'Alberta', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat', 'St. Albert', 'Grande Prairie', 'Airdrie', 'Spruce Grove', 'Leduc', 'Fort McMurray', 'Lloydminster', 'Chestermere', 'Camrose', 'Brooks'] },
          { name: 'Manitoba', cities: ['Winnipeg', 'Brandon', 'Steinbach', 'Thompson', 'Portage la Prairie', 'Winkler', 'Selkirk', 'Morden', 'Flin Flon', 'The Pas', 'Dauphin', 'Stonewall', 'Altona', 'Neepawa', 'Swan River'] },
          { name: 'Saskatchewan', cities: ['Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Swift Current', 'Yorkton', 'North Battleford', 'Estevan', 'Weyburn', 'Martensville', 'Lloydminster', 'Melfort', 'Melville', 'Kindersley', 'La Ronge'] },
          { name: 'Nova Scotia', cities: ['Halifax', 'Sydney', 'Dartmouth', 'Truro', 'New Glasgow', 'Glace Bay', 'Bedford', 'Sydney Mines', 'Amherst', 'Bridgewater', 'Yarmouth', 'Kentville', 'Wolfville', 'Antigonish', 'Lunenburg'] },
          { name: 'New Brunswick', cities: ['Moncton', 'Saint John', 'Fredericton', 'Miramichi', 'Dieppe', 'Riverview', 'Quispamsis', 'Bathurst', 'Edmundston', 'Oromocto', 'Campbellton', 'Shediac', 'Grand Falls', 'Sussex', 'Caraquet'] },
          { name: 'Newfoundland and Labrador', cities: ["St. John's", 'Mount Pearl', 'Corner Brook', 'Conception Bay South', 'Grand Falls-Windsor', 'Paradise', 'Gander', 'Happy Valley-Goose Bay', 'Labrador City', 'Stephenville', 'Clarenville', 'Bay Roberts', 'Carbonear', 'Deer Lake', 'Channel-Port aux Basques'] },
          { name: 'Prince Edward Island', cities: ['Charlottetown', 'Summerside', 'Stratford', 'Cornwall', 'Montague', 'Kensington', 'Souris', 'Alberton', 'Tignish', 'Georgetown', 'Morell', 'Murray River', 'Crapaud', 'Borden-Carleton', 'Victoria'] },
          { name: 'Northwest Territories', cities: ['Yellowknife', 'Hay River', 'Inuvik', 'Fort Smith', 'Behchokǫ̀', 'Norman Wells', 'Fort Simpson', 'Tuktoyaktuk', 'Whatì', 'Délı̨nę', 'Fort Providence', 'Fort Resolution', 'Paulatuk', 'Sachs Harbour', 'Ulukhaktok'] },
          { name: 'Yukon', cities: ['Whitehorse', 'Dawson City', 'Watson Lake', 'Haines Junction', 'Carmacks', 'Mayo', 'Faro', 'Teslin', 'Pelly Crossing', 'Ross River', 'Carcross', 'Tagish', 'Mount Lorne', 'Ibex Valley', 'Old Crow'] },
          { name: 'Nunavut', cities: ['Iqaluit', 'Rankin Inlet', 'Arviat', 'Cambridge Bay', 'Baker Lake', 'Pond Inlet', 'Igloolik', 'Kugluktuk', 'Pangnirtung', 'Cape Dorset', 'Gjoa Haven', 'Resolute', 'Coral Harbour', 'Taloyoak', 'Hall Beach'] },
          { name: 'Northern Ontario', cities: ['Timmins', 'Sault Ste. Marie', 'North Bay', 'Kenora', 'Elliot Lake', 'Dryden', 'Temiskaming Shores', 'Cochrane', 'Marathon', 'Manitouwadge', 'Red Lake', 'Sioux Lookout', 'Kapuskasing', 'Hearst', 'Geraldton'] },
          { name: 'Eastern Townships', cities: ['Bromont', 'Cowansville', 'Farnham', 'Granby', 'Magog', 'Sutton', 'Waterloo', 'Knowlton', 'Dunham', 'Sweetsburg', 'Austin', 'Potton', 'Stanstead', 'Hatley', 'North Hatley'] }
        ]
      },
    
      
        'United Kingdom': {
          provinces: [
            { name: 'England', cities: ['London', 'Birmingham', 'Manchester', 'Liverpool', 'Leeds', 'Sheffield', 'Bristol', 'Newcastle', 'Nottingham', 'Leicester', 'Coventry', 'Bradford', 'Stoke-on-Trent', 'Wolverhampton', 'Plymouth'] },
            { name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Paisley', 'East Kilbride', 'Livingston', 'Hamilton', 'Cumbernauld', 'Kirkcaldy', 'Inverness', 'Perth', 'Stirling', 'Ayr', 'Falkirk'] },
            { name: 'Wales', cities: ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry', 'Caerphilly', 'Rhondda', 'Port Talbot', 'Bridgend', 'Llanelli', 'Merthyr Tydfil', 'Bangor', 'Aberystwyth', 'Carmarthen', 'Haverfordwest'] },
            { name: 'Northern Ireland', cities: ['Belfast', 'Derry', 'Lisburn', 'Newtownabbey', 'Bangor', 'Craigavon', 'Castlereagh', 'Antrim', 'Newry', 'Carrickfergus', 'Ballymena', 'Coleraine', 'Portadown', 'Omagh', 'Enniskillen'] },
            { name: 'Greater London', cities: ['Westminster', 'Camden', 'Islington', 'Kensington', 'Chelsea', 'Hammersmith', 'Wandsworth', 'Lambeth', 'Southwark', 'Tower Hamlets', 'Hackney', 'Haringey', 'Barnet', 'Brent', 'Ealing'] },
            { name: 'West Midlands', cities: ['Birmingham', 'Coventry', 'Wolverhampton', 'Dudley', 'Walsall', 'Solihull', 'Stourbridge', 'Halesowen', 'Oldbury', 'Smethwick', 'West Bromwich', 'Sutton Coldfield', 'Warley', 'Rowley Regis', 'Tipton'] },
            { name: 'Greater Manchester', cities: ['Manchester', 'Salford', 'Bolton', 'Stockport', 'Oldham', 'Rochdale', 'Bury', 'Wigan', 'Trafford', 'Tameside', 'Altrincham', 'Ashton-under-Lyne', 'Eccles', 'Farnworth', 'Radcliffe'] },
            { name: 'West Yorkshire', cities: ['Leeds', 'Bradford', 'Wakefield', 'Huddersfield', 'Halifax', 'Dewsbury', 'Keighley', 'Pudsey', 'Morley', 'Batley', 'Bingley', 'Brighouse', 'Castleford', 'Ossett', 'Sowerby Bridge'] },
            { name: 'Merseyside', cities: ['Liverpool', 'Birkenhead', 'St Helens', 'Bootle', 'Southport', 'Wallasey', 'Bebington', 'Huyton', 'Crosby', 'Formby', 'Litherland', 'Prescot', 'Maghull', 'Kirkby', 'Newton-le-Willows'] },
            { name: 'South East England', cities: ['Brighton', 'Southampton', 'Portsmouth', 'Oxford', 'Reading', 'Milton Keynes', 'Slough', 'Crawley', 'Worthing', 'Eastbourne', 'Basingstoke', 'Guildford', 'Maidenhead', 'Winchester', 'Chatham'] },
            { name: 'East of England', cities: ['Luton', 'Norwich', 'Peterborough', 'Southend-on-Sea', 'Watford', 'Ipswich', 'Colchester', 'Chelmsford', 'Basildon', 'Harlow', 'Stevenage', 'Bedford', 'Cambridge', 'Huntingdon', 'St Albans'] },
            { name: 'South West England', cities: ['Bristol', 'Plymouth', 'Bournemouth', 'Swindon', 'Exeter', 'Gloucester', 'Torquay', 'Cheltenham', 'Bath', 'Weston-super-Mare', 'Poole', 'Salisbury', 'Taunton', 'Yeovil', 'Truro'] },
            { name: 'East Midlands', cities: ['Nottingham', 'Leicester', 'Derby', 'Northampton', 'Lincoln', 'Mansfield', 'Chesterfield', 'Loughborough', 'Corby', 'Kettering', 'Grantham', 'Boston', 'Melton Mowbray', 'Oakham', 'Stamford'] },
            { name: 'North East England', cities: ['Newcastle upon Tyne', 'Sunderland', 'Middlesbrough', 'Gateshead', 'South Shields', 'Hartlepool', 'Darlington', 'Stockton-on-Tees', 'Washington', 'Jarrow', 'Peterlee', 'Seaham', 'Consett', 'Stanley', 'Blyth'] },
            { name: 'Scottish Highlands and Islands', cities: ['Inverness', 'Fort William', 'Thurso', 'Wick', 'Ullapool', 'Stornoway', 'Portree', 'Kyle of Lochalsh', 'Oban', 'Lochgilphead', 'Campbeltown', 'Dunoon', 'Tobermory', 'Lerwick', 'Kirkwall'] }
          ]
        }
      ,
  'Australia': {
    provinces: [
      { name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Maitland', 'Albury', 'Wagga Wagga', 'Tamworth', 'Orange', 'Dubbo', 'Nowra'] },
      { name: 'Victoria', cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton', 'Warrnambool', 'Mildura', 'Traralgon', 'Melton', 'Sunbury'] },
      { name: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Townsville', 'Cairns', 'Toowoomba', 'Rockhampton', 'Mackay', 'Bundaberg', 'Hervey Bay', 'Gladstone'] },
      { name: 'Western Australia', cities: ['Perth', 'Fremantle', 'Rockingham', 'Mandurah', 'Bunbury', 'Geraldton', 'Kalgoorlie', 'Albany', 'Broome', 'Port Hedland'] },
      { name: 'South Australia', cities: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Murray Bridge', 'Port Augusta', 'Port Pirie', 'Port Lincoln', 'Kadina', 'Berri', 'Roxby Downs'] }
    ]
  },
  'Germany': {
    provinces: [
      { name: 'Bavaria', cities: ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg', 'Würzburg', 'Ingolstadt', 'Fürth', 'Erlangen', 'Bayreuth', 'Bamberg'] },
      { name: 'North Rhine-Westphalia', cities: ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Duisburg', 'Bochum', 'Wuppertal', 'Bielefeld', 'Bonn', 'Münster'] },
      { name: 'Baden-Württemberg', cities: ['Stuttgart', 'Mannheim', 'Karlsruhe', 'Freiburg', 'Heidelberg', 'Heilbronn', 'Ulm', 'Pforzheim', 'Reutlingen', 'Tübingen'] },
      { name: 'Lower Saxony', cities: ['Hanover', 'Braunschweig', 'Osnabrück', 'Oldenburg', 'Göttingen', 'Hildesheim', 'Salzgitter', 'Wolfsburg', 'Emden', 'Delmenhorst'] },
      { name: 'Hesse', cities: ['Frankfurt', 'Wiesbaden', 'Kassel', 'Darmstadt', 'Offenbach', 'Fulda', 'Gießen', 'Marburg', 'Rüsselsheim', 'Hanau'] }
    ]
  },
  'France': {
    provinces: [
      { name: 'Île-de-France', cities: ['Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Argenteuil', 'Montreuil', 'Créteil', 'Nanterre', 'Vitry-sur-Seine', 'Colombes', 'Aulnay-sous-Bois'] },
      { name: 'Auvergne-Rhône-Alpes', cities: ['Lyon', 'Saint-Étienne', 'Grenoble', 'Villeurbanne', 'Valence', 'Annecy', 'Chambéry', 'Clermont-Ferrand', 'Vénissieux', 'Saint-Priest'] },
      { name: 'Provence-Alpes-Côte d\'Azur', cities: ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence', 'Avignon', 'Cannes', 'Antibes', 'La Seyne-sur-Mer', 'Hyères', 'Fréjus'] },
      { name: 'Occitanie', cities: ['Toulouse', 'Montpellier', 'Nîmes', 'Perpignan', 'Béziers', 'Montauban', 'Albi', 'Carcassonne', 'Narbonne', 'Sète'] },
      { name: 'Nouvelle-Aquitaine', cities: ['Bordeaux', 'Limoges', 'Poitiers', 'La Rochelle', 'Angoulême', 'Bayonne', 'Pau', 'Agen', 'Brive-la-Gaillarde', 'Niort'] }
    ]
  },
  'Japan': {
    provinces: [
      { name: 'Tokyo', cities: ['Tokyo', 'Shibuya', 'Shinjuku', 'Chiyoda', 'Chuo', 'Minato', 'Taito', 'Sumida', 'Koto', 'Shinagawa'] },
      { name: 'Osaka', cities: ['Osaka', 'Sakai', 'Higashiosaka', 'Toyonaka', 'Takatsuki', 'Hirakata', 'Suita', 'Yao', 'Ibaraki', 'Neyagawa'] },
      { name: 'Kanagawa', cities: ['Yokohama', 'Kawasaki', 'Sagamihara', 'Yokosuka', 'Fujisawa', 'Chigasaki', 'Atsugi', 'Yamato', 'Odawara', 'Kamakura'] },
      { name: 'Aichi', cities: ['Nagoya', 'Toyota', 'Toyohashi', 'Okazaki', 'Ichinomiya', 'Kasugai', 'Anjo', 'Kariya', 'Komaki', 'Inazawa'] },
      { name: 'Hyogo', cities: ['Kobe', 'Himeji', 'Nishinomiya', 'Amagasaki', 'Ashiya', 'Itami', 'Kakogawa', 'Takarazuka', 'Akashi', 'Sanda'] }
    ]
  },
  
    'India': {
      provinces: [
        { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Sangli', 'Nanded', 'Jalgaon', 'Akola', 'Latur', 'Dhule'] },
        { name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga', 'Tumkur', 'Raichur', 'Bidar', 'Hospet', 'Udupi'] },
        { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukkudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Kanchipuram', 'Kumbakonam'] },
        { name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Nadiad', 'Morbi', 'Anand', 'Bharuch', 'Navsari', 'Veraval', 'Porbandar'] },
        { name: 'Delhi', cities: ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'North East Delhi', 'North West Delhi', 'South West Delhi', 'Shahdara', 'Karol Bagh', 'Rohini', 'Pitampura', 'Dwarka', 'Vasant Kunj'] },
        { name: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Allahabad', 'Meerut', 'Ghaziabad', 'Aligarh', 'Moradabad', 'Bareilly', 'Saharanpur', 'Gorakhpur', 'Faizabad', 'Jhansi', 'Mathura'] },
        { name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Tonk', 'Hanumangarh', 'Chittorgarh'] },
        { name: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Kharagpur', 'Haldia', 'Krishnanagar', 'Darjeeling', 'Jalpaiguri', 'Baharampur', 'Cooch Behar', 'Balurghat'] },
        { name: 'Madhya Pradesh', cities: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Katni', 'Burhanpur', 'Shivpuri', 'Chhindwara', 'Mandsaur'] },
        { name: 'Punjab', cities: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Hoshiarpur', 'Mohali', 'Pathankot', 'Moga', 'Abohar', 'Malerkotla', 'Khanna', 'Phagwara', 'Barnala'] },
        { name: 'Haryana', cities: ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Thanesar'] },
        { name: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Kollam', 'Thrissur', 'Kannur', 'Alappuzha', 'Kottayam', 'Palakkad', 'Manjeri', 'Thalassery', 'Pathanamthitta', 'Ponnani', 'Tirur', 'Changanassery'] },
        { name: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Kakinada', 'Kadapa', 'Anantapur', 'Rajahmundry', 'Tirupati', 'Eluru', 'Ongole', 'Chittoor', 'Hindupur', 'Proddatur'] },
        { name: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam', 'Mahbubnagar', 'Adilabad', 'Siddipet', 'Nalgonda', 'Mancherial', 'Sangareddy', 'Miryalaguda', 'Jagtial', 'Vikarabad'] },
        { name: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chapra', 'Sasaram', 'Hajipur', 'Siwan', 'Sitamarhi'] }
      ]
    }
  ,
  'Singapore': {
    provinces: [
      { name: 'Central Region', cities: ['Singapore', 'Marina Bay', 'Orchard', 'Raffles Place', 'Clarke Quay', 'Chinatown', 'Little India', 'Bugis', 'Dhoby Ghaut', 'City Hall'] },
      { name: 'East Region', cities: ['Tampines', 'Pasir Ris', 'Bedok', 'Changi', 'Simei', 'Eunos', 'Kembangan', 'Paya Lebar', 'Aljunied', 'MacPherson'] },
      { name: 'North Region', cities: ['Woodlands', 'Sembawang', 'Yishun', 'Ang Mo Kio', 'Seletar', 'Punggol', 'Sengkang', 'Hougang', 'Serangoon', 'Bishan'] },
      { name: 'North East Region', cities: ['Sengkang', 'Punggol', 'Hougang', 'Serangoon', 'Ang Mo Kio', 'Bishan', 'Toa Payoh', 'Braddell', 'Lorong Chuan', 'Marymount'] },
      { name: 'West Region', cities: ['Jurong', 'Boon Lay', 'Pioneer', 'Joo Koon', 'Gul Circle', 'Tuas', 'Clementi', 'Dover', 'Buona Vista', 'Holland Village'] }
    ]
  },
  'Malaysia': {
    provinces: [
      { name: 'Selangor', cities: ['Kuala Lumpur', 'Shah Alam', 'Petaling Jaya', 'Subang Jaya', 'Klang', 'Ampang', 'Kajang', 'Selayang', 'Rawang', 'Semenyih'] },
      { name: 'Johor', cities: ['Johor Bahru', 'Kluang', 'Batu Pahat', 'Muar', 'Kulai', 'Segamat', 'Pontian', 'Kota Tinggi', 'Mersing', 'Tangkak'] },
      { name: 'Penang', cities: ['George Town', 'Butterworth', 'Bukit Mertajam', 'Nibong Tebal', 'Bayan Lepas', 'Tanjung Bungah', 'Batu Ferringhi', 'Gelugor', 'Air Itam', 'Pulau Tikus'] },
      { name: 'Perak', cities: ['Ipoh', 'Taiping', 'Sitiawan', 'Teluk Intan', 'Kuala Kangsar', 'Lumut', 'Kampar', 'Batu Gajah', 'Simpang Pulai', 'Tanjung Malim'] },
      { name: 'Sabah', cities: ['Kota Kinabalu', 'Sandakan', 'Tawau', 'Lahad Datu', 'Keningau', 'Kudat', 'Semporna', 'Beaufort', 'Papar', 'Kota Belud'] }
    ]
  },
  'Indonesia': {
    provinces: [
      { name: 'Jakarta', cities: ['Jakarta', 'Central Jakarta', 'North Jakarta', 'South Jakarta', 'East Jakarta', 'West Jakarta', 'Thousand Islands'] },
      { name: 'West Java', cities: ['Bandung', 'Bogor', 'Depok', 'Tangerang', 'Bekasi', 'Cirebon', 'Sukabumi', 'Cianjur', 'Karawang', 'Purwakarta'] },
      { name: 'East Java', cities: ['Surabaya', 'Malang', 'Kediri', 'Blitar', 'Mojokerto', 'Pasuruan', 'Probolinggo', 'Lumajang', 'Jember', 'Banyuwangi'] },
      { name: 'Central Java', cities: ['Semarang', 'Surakarta', 'Salatiga', 'Magelang', 'Pekalongan', 'Tegal', 'Cilacap', 'Banyumas', 'Purbalingga', 'Banjarnegara'] },
      { name: 'Banten', cities: ['Serang', 'Tangerang', 'Cilegon', 'Lebak', 'Pandeglang', 'Rangkasbitung', 'Curug', 'Balaraja', 'Cikupa', 'Cisauk'] }
    ]
  },
  'Thailand': {
    provinces: [
      { name: 'Bangkok', cities: ['Bangkok', 'Chatuchak', 'Bang Sue', 'Dusit', 'Phaya Thai', 'Ratchathewi', 'Sathon', 'Bang Rak', 'Khlong Toei', 'Watthana'] },
      { name: 'Chiang Mai', cities: ['Chiang Mai', 'Mae Rim', 'Mae Taeng', 'Chom Thong', 'Doi Tao', 'Hot', 'Om Koi', 'Samoeng', 'San Pa Tong', 'San Kamphaeng'] },
      { name: 'Phuket', cities: ['Phuket', 'Kathu', 'Thalang', 'Mueang Phuket', 'Rawai', 'Chalong', 'Karon', 'Patong', 'Kamala', 'Surin'] },
      { name: 'Pattaya', cities: ['Pattaya', 'Bang Lamung', 'Sattahip', 'Si Racha', 'Ban Bueng', 'Phanat Nikhom', 'Ko Chan', 'Nong Yai', 'Phan Thong', 'Chon Buri'] },
      { name: 'Krabi', cities: ['Krabi', 'Ao Nang', 'Railay', 'Phi Phi', 'Ko Lanta', 'Ko Yao', 'Ko Hong'] }
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
      // Basic required fields validation without altering existing UI/logic
      const requiredFields = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'jobCategory',
        'yourTitle',
        'experience',
        'dateOfBirth'
      ] as const
      const hasEmptyRequired = requiredFields.some((field) => !String((formData as any)[field] || '').trim())
      if (hasEmptyRequired) {
        try { (window as any).ProfileSave?.error('Please fill all details') } catch {}
        return
      }
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
            <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name <span className='text-red-500'>*</span></Label>
            <Input
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={!isEditing}
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name <span className='text-red-500'>*</span></Label>
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
            <Label htmlFor="email" className="text-gray-700 font-medium">Email Address<span className='text-red-500'>*</span></Label>
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
            <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number<span className='text-red-500'>*</span></Label>
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
            <Label htmlFor="jobCategory" className="text-gray-700 font-medium">Job Category<span className='text-red-500'>*</span></Label>
            <Select required value={formData.jobCategory} onValueChange={(val) => handleInputChange('jobCategory', val)} disabled={!isEditing}>
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
            <Label htmlFor="yourTitle" className="text-gray-700 font-medium">Your Title<span className='text-red-500'>*</span></Label>
            <Input
              id="yourTitle"
              required
              value={formData.yourTitle}
              onChange={(e) => handleInputChange('yourTitle', e.target.value)}
              disabled={!isEditing}
              placeholder="e.g., Senior Software Developer"
              className={isEditing ? "border-emerald-300 focus:border-emerald-500" : "bg-gray-50"}
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-gray-700 font-medium">Experience Level <span className='text-red-500'>*</span></Label>
            <Select required value={formData.experience} onValueChange={(val) => handleInputChange('experience', val)} disabled={!isEditing}>
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
            <Label htmlFor="dateOfBirth" className="text-gray-700 font-medium">Date of Birth <span className='text-red-500'>*</span></Label>
            <Input
              id="dateOfBirth"
              required
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