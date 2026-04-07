export interface SamplePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'tube_station' | 'rail_station' | 'grid';
}

// Major tube and rail stations across London (zones 1-4)
const STATIONS: SamplePoint[] = [
  // Central London
  { id: 'kings-cross', name: "King's Cross", lat: 51.5308, lng: -0.1238, type: 'tube_station' },
  { id: 'euston', name: 'Euston', lat: 51.5282, lng: -0.1337, type: 'tube_station' },
  { id: 'st-pancras', name: 'St Pancras', lat: 51.5321, lng: -0.1266, type: 'rail_station' },
  { id: 'paddington', name: 'Paddington', lat: 51.5154, lng: -0.1755, type: 'tube_station' },
  { id: 'liverpool-street', name: 'Liverpool Street', lat: 51.5178, lng: -0.0823, type: 'tube_station' },
  { id: 'victoria', name: 'Victoria', lat: 51.4965, lng: -0.1447, type: 'tube_station' },
  { id: 'waterloo', name: 'Waterloo', lat: 51.5033, lng: -0.1127, type: 'tube_station' },
  { id: 'london-bridge', name: 'London Bridge', lat: 51.5052, lng: -0.0864, type: 'tube_station' },
  { id: 'bank', name: 'Bank', lat: 51.5133, lng: -0.0886, type: 'tube_station' },
  { id: 'oxford-circus', name: 'Oxford Circus', lat: 51.5152, lng: -0.1415, type: 'tube_station' },
  { id: 'tottenham-court-road', name: 'Tottenham Court Road', lat: 51.5165, lng: -0.1310, type: 'tube_station' },
  { id: 'leicester-square', name: 'Leicester Square', lat: 51.5113, lng: -0.1281, type: 'tube_station' },
  { id: 'piccadilly-circus', name: 'Piccadilly Circus', lat: 51.5100, lng: -0.1347, type: 'tube_station' },
  { id: 'covent-garden', name: 'Covent Garden', lat: 51.5129, lng: -0.1243, type: 'tube_station' },
  { id: 'holborn', name: 'Holborn', lat: 51.5174, lng: -0.1201, type: 'tube_station' },
  { id: 'chancery-lane', name: 'Chancery Lane', lat: 51.5185, lng: -0.1112, type: 'tube_station' },
  { id: 'farringdon', name: 'Farringdon', lat: 51.5203, lng: -0.1053, type: 'tube_station' },
  { id: 'barbican', name: 'Barbican', lat: 51.5204, lng: -0.0979, type: 'tube_station' },
  { id: 'moorgate', name: 'Moorgate', lat: 51.5186, lng: -0.0886, type: 'tube_station' },
  { id: 'old-street', name: 'Old Street', lat: 51.5263, lng: -0.0876, type: 'tube_station' },
  { id: 'angel', name: 'Angel', lat: 51.5322, lng: -0.1058, type: 'tube_station' },
  { id: 'warren-street', name: 'Warren Street', lat: 51.5247, lng: -0.1384, type: 'tube_station' },
  { id: 'goodge-street', name: 'Goodge Street', lat: 51.5205, lng: -0.1347, type: 'tube_station' },
  { id: 'russell-square', name: 'Russell Square', lat: 51.5230, lng: -0.1244, type: 'tube_station' },
  { id: 'embankment', name: 'Embankment', lat: 51.5074, lng: -0.1223, type: 'tube_station' },
  { id: 'westminster', name: 'Westminster', lat: 51.5010, lng: -0.1254, type: 'tube_station' },
  { id: 'green-park', name: 'Green Park', lat: 51.5067, lng: -0.1428, type: 'tube_station' },
  { id: 'bond-street', name: 'Bond Street', lat: 51.5142, lng: -0.1494, type: 'tube_station' },
  { id: 'marble-arch', name: 'Marble Arch', lat: 51.5136, lng: -0.1586, type: 'tube_station' },
  { id: 'hyde-park-corner', name: 'Hyde Park Corner', lat: 51.5027, lng: -0.1527, type: 'tube_station' },
  { id: 'knightsbridge', name: 'Knightsbridge', lat: 51.5015, lng: -0.1607, type: 'tube_station' },
  { id: 'sloane-square', name: 'Sloane Square', lat: 51.4924, lng: -0.1565, type: 'tube_station' },
  { id: 'pimlico', name: 'Pimlico', lat: 51.4893, lng: -0.1334, type: 'tube_station' },
  { id: 'vauxhall', name: 'Vauxhall', lat: 51.4861, lng: -0.1253, type: 'tube_station' },
  { id: 'temple', name: 'Temple', lat: 51.5111, lng: -0.1141, type: 'tube_station' },
  { id: 'blackfriars', name: 'Blackfriars', lat: 51.5120, lng: -0.1040, type: 'tube_station' },
  { id: 'st-pauls', name: "St Paul's", lat: 51.5154, lng: -0.0983, type: 'tube_station' },
  { id: 'mansion-house', name: 'Mansion House', lat: 51.5122, lng: -0.0940, type: 'tube_station' },
  { id: 'cannon-street', name: 'Cannon Street', lat: 51.5114, lng: -0.0901, type: 'tube_station' },
  { id: 'monument', name: 'Monument', lat: 51.5108, lng: -0.0863, type: 'tube_station' },
  { id: 'tower-hill', name: 'Tower Hill', lat: 51.5098, lng: -0.0766, type: 'tube_station' },
  { id: 'aldgate', name: 'Aldgate', lat: 51.5143, lng: -0.0755, type: 'tube_station' },
  { id: 'aldgate-east', name: 'Aldgate East', lat: 51.5152, lng: -0.0715, type: 'tube_station' },

  // Northern Line
  { id: 'camden-town', name: 'Camden Town', lat: 51.5392, lng: -0.1426, type: 'tube_station' },
  { id: 'chalk-farm', name: 'Chalk Farm', lat: 51.5441, lng: -0.1538, type: 'tube_station' },
  { id: 'kentish-town', name: 'Kentish Town', lat: 51.5507, lng: -0.1406, type: 'tube_station' },
  { id: 'tufnell-park', name: 'Tufnell Park', lat: 51.5567, lng: -0.1380, type: 'tube_station' },
  { id: 'archway', name: 'Archway', lat: 51.5653, lng: -0.1353, type: 'tube_station' },
  { id: 'highgate', name: 'Highgate', lat: 51.5777, lng: -0.1466, type: 'tube_station' },
  { id: 'east-finchley', name: 'East Finchley', lat: 51.5874, lng: -0.1650, type: 'tube_station' },
  { id: 'finchley-central', name: 'Finchley Central', lat: 51.6012, lng: -0.1927, type: 'tube_station' },
  { id: 'stockwell', name: 'Stockwell', lat: 51.4723, lng: -0.1228, type: 'tube_station' },
  { id: 'oval', name: 'Oval', lat: 51.4819, lng: -0.1132, type: 'tube_station' },
  { id: 'kennington', name: 'Kennington', lat: 51.4884, lng: -0.1053, type: 'tube_station' },
  { id: 'elephant-and-castle', name: 'Elephant & Castle', lat: 51.4943, lng: -0.1001, type: 'tube_station' },
  { id: 'borough', name: 'Borough', lat: 51.5011, lng: -0.0943, type: 'tube_station' },
  { id: 'clapham-north', name: 'Clapham North', lat: 51.4649, lng: -0.1299, type: 'tube_station' },
  { id: 'clapham-common', name: 'Clapham Common', lat: 51.4618, lng: -0.1384, type: 'tube_station' },
  { id: 'clapham-south', name: 'Clapham South', lat: 51.4527, lng: -0.1480, type: 'tube_station' },
  { id: 'balham', name: 'Balham', lat: 51.4431, lng: -0.1525, type: 'tube_station' },
  { id: 'tooting-bec', name: 'Tooting Bec', lat: 51.4355, lng: -0.1594, type: 'tube_station' },
  { id: 'tooting-broadway', name: 'Tooting Broadway', lat: 51.4275, lng: -0.1681, type: 'tube_station' },
  { id: 'morden', name: 'Morden', lat: 51.4022, lng: -0.1948, type: 'tube_station' },

  // Victoria Line
  { id: 'brixton', name: 'Brixton', lat: 51.4627, lng: -0.1145, type: 'tube_station' },
  { id: 'highbury-islington', name: 'Highbury & Islington', lat: 51.5460, lng: -0.1040, type: 'tube_station' },
  { id: 'finsbury-park', name: 'Finsbury Park', lat: 51.5642, lng: -0.1065, type: 'tube_station' },
  { id: 'seven-sisters', name: 'Seven Sisters', lat: 51.5822, lng: -0.0749, type: 'tube_station' },
  { id: 'tottenham-hale', name: 'Tottenham Hale', lat: 51.5882, lng: -0.0594, type: 'tube_station' },
  { id: 'walthamstow-central', name: 'Walthamstow Central', lat: 51.5830, lng: -0.0197, type: 'tube_station' },

  // Piccadilly Line
  { id: 'south-kensington', name: 'South Kensington', lat: 51.4941, lng: -0.1738, type: 'tube_station' },
  { id: 'gloucester-road', name: 'Gloucester Road', lat: 51.4945, lng: -0.1829, type: 'tube_station' },
  { id: 'earls-court', name: "Earl's Court", lat: 51.4914, lng: -0.1934, type: 'tube_station' },
  { id: 'hammersmith', name: 'Hammersmith', lat: 51.4927, lng: -0.2246, type: 'tube_station' },
  { id: 'barons-court', name: "Baron's Court", lat: 51.4903, lng: -0.2139, type: 'tube_station' },
  { id: 'turnham-green', name: 'Turnham Green', lat: 51.4951, lng: -0.2547, type: 'tube_station' },
  { id: 'acton-town', name: 'Acton Town', lat: 51.5028, lng: -0.2801, type: 'tube_station' },
  { id: 'ealing-common', name: 'Ealing Common', lat: 51.5101, lng: -0.2883, type: 'tube_station' },
  { id: 'holloway-road', name: 'Holloway Road', lat: 51.5526, lng: -0.1132, type: 'tube_station' },
  { id: 'caledonian-road', name: 'Caledonian Road', lat: 51.5481, lng: -0.1188, type: 'tube_station' },
  { id: 'arsenal', name: 'Arsenal', lat: 51.5586, lng: -0.1059, type: 'tube_station' },
  { id: 'manor-house', name: 'Manor House', lat: 51.5712, lng: -0.0958, type: 'tube_station' },
  { id: 'turnpike-lane', name: 'Turnpike Lane', lat: 51.5904, lng: -0.1028, type: 'tube_station' },
  { id: 'wood-green', name: 'Wood Green', lat: 51.5975, lng: -0.1097, type: 'tube_station' },

  // Central Line
  { id: 'notting-hill-gate', name: 'Notting Hill Gate', lat: 51.5094, lng: -0.1967, type: 'tube_station' },
  { id: 'holland-park', name: 'Holland Park', lat: 51.5075, lng: -0.2060, type: 'tube_station' },
  { id: 'shepherds-bush', name: "Shepherd's Bush", lat: 51.5046, lng: -0.2187, type: 'tube_station' },
  { id: 'white-city', name: 'White City', lat: 51.5120, lng: -0.2244, type: 'tube_station' },
  { id: 'east-acton', name: 'East Acton', lat: 51.5168, lng: -0.2474, type: 'tube_station' },
  { id: 'north-acton', name: 'North Acton', lat: 51.5237, lng: -0.2597, type: 'tube_station' },
  { id: 'bethnal-green', name: 'Bethnal Green', lat: 51.5270, lng: -0.0549, type: 'tube_station' },
  { id: 'mile-end', name: 'Mile End', lat: 51.5249, lng: -0.0332, type: 'tube_station' },
  { id: 'stratford', name: 'Stratford', lat: 51.5416, lng: -0.0042, type: 'tube_station' },
  { id: 'leyton', name: 'Leyton', lat: 51.5566, lng: -0.0053, type: 'tube_station' },
  { id: 'leytonstone', name: 'Leytonstone', lat: 51.5683, lng: 0.0083, type: 'tube_station' },
  { id: 'lancaster-gate', name: 'Lancaster Gate', lat: 51.5119, lng: -0.1756, type: 'tube_station' },
  { id: 'queensway', name: 'Queensway', lat: 51.5107, lng: -0.1871, type: 'tube_station' },

  // District / Hammersmith & City
  { id: 'west-ham', name: 'West Ham', lat: 51.5287, lng: 0.0056, type: 'tube_station' },
  { id: 'plaistow', name: 'Plaistow', lat: 51.5313, lng: 0.0172, type: 'tube_station' },
  { id: 'east-ham', name: 'East Ham', lat: 51.5394, lng: 0.0518, type: 'tube_station' },
  { id: 'barking', name: 'Barking', lat: 51.5396, lng: 0.0809, type: 'tube_station' },
  { id: 'putney-bridge', name: 'Putney Bridge', lat: 51.4682, lng: -0.2089, type: 'tube_station' },
  { id: 'parsons-green', name: 'Parsons Green', lat: 51.4753, lng: -0.2013, type: 'tube_station' },
  { id: 'fulham-broadway', name: 'Fulham Broadway', lat: 51.4800, lng: -0.1952, type: 'tube_station' },
  { id: 'west-brompton', name: 'West Brompton', lat: 51.4872, lng: -0.1953, type: 'tube_station' },
  { id: 'wimbledon', name: 'Wimbledon', lat: 51.4214, lng: -0.2064, type: 'tube_station' },
  { id: 'east-putney', name: 'East Putney', lat: 51.4590, lng: -0.2112, type: 'tube_station' },
  { id: 'southfields', name: 'Southfields', lat: 51.4454, lng: -0.2066, type: 'tube_station' },
  { id: 'wimbledon-park', name: 'Wimbledon Park', lat: 51.4343, lng: -0.1992, type: 'tube_station' },

  // Jubilee Line
  { id: 'canary-wharf', name: 'Canary Wharf', lat: 51.5055, lng: -0.0196, type: 'tube_station' },
  { id: 'canada-water', name: 'Canada Water', lat: 51.4982, lng: -0.0502, type: 'tube_station' },
  { id: 'bermondsey', name: 'Bermondsey', lat: 51.4979, lng: -0.0637, type: 'tube_station' },
  { id: 'southwark', name: 'Southwark', lat: 51.5040, lng: -0.1050, type: 'tube_station' },
  { id: 'north-greenwich', name: 'North Greenwich', lat: 51.5005, lng: 0.0039, type: 'tube_station' },
  { id: 'west-hampstead', name: 'West Hampstead', lat: 51.5469, lng: -0.1910, type: 'tube_station' },
  { id: 'kilburn', name: 'Kilburn', lat: 51.5471, lng: -0.2047, type: 'tube_station' },
  { id: 'swiss-cottage', name: 'Swiss Cottage', lat: 51.5432, lng: -0.1743, type: 'tube_station' },
  { id: 'st-johns-wood', name: "St John's Wood", lat: 51.5347, lng: -0.1740, type: 'tube_station' },
  { id: 'baker-street', name: 'Baker Street', lat: 51.5226, lng: -0.1571, type: 'tube_station' },

  // Bakerloo Line
  { id: 'queens-park', name: "Queen's Park", lat: 51.5341, lng: -0.2047, type: 'tube_station' },
  { id: 'kensal-green', name: 'Kensal Green', lat: 51.5304, lng: -0.2249, type: 'tube_station' },
  { id: 'willesden-junction', name: 'Willesden Junction', lat: 51.5326, lng: -0.2444, type: 'tube_station' },
  { id: 'harlesden', name: 'Harlesden', lat: 51.5362, lng: -0.2575, type: 'tube_station' },
  { id: 'stonebridge-park', name: 'Stonebridge Park', lat: 51.5440, lng: -0.2759, type: 'tube_station' },
  { id: 'wembley-central', name: 'Wembley Central', lat: 51.5522, lng: -0.2963, type: 'tube_station' },
  { id: 'maida-vale', name: 'Maida Vale', lat: 51.5298, lng: -0.1854, type: 'tube_station' },
  { id: 'warwick-avenue', name: 'Warwick Avenue', lat: 51.5235, lng: -0.1835, type: 'tube_station' },
  { id: 'edgware-road-bakerloo', name: 'Edgware Road', lat: 51.5199, lng: -0.1679, type: 'tube_station' },
  { id: 'lambeth-north', name: 'Lambeth North', lat: 51.4986, lng: -0.1115, type: 'tube_station' },

  // Overground / Elizabeth Line key stations
  { id: 'shoreditch-high-street', name: 'Shoreditch High Street', lat: 51.5234, lng: -0.0756, type: 'rail_station' },
  { id: 'dalston-junction', name: 'Dalston Junction', lat: 51.5462, lng: -0.0753, type: 'rail_station' },
  { id: 'hackney-central', name: 'Hackney Central', lat: 51.5468, lng: -0.0566, type: 'rail_station' },
  { id: 'hackney-downs', name: 'Hackney Downs', lat: 51.5488, lng: -0.0603, type: 'rail_station' },
  { id: 'homerton', name: 'Homerton', lat: 51.5468, lng: -0.0394, type: 'rail_station' },
  { id: 'whitechapel', name: 'Whitechapel', lat: 51.5194, lng: -0.0612, type: 'tube_station' },
  { id: 'shadwell', name: 'Shadwell', lat: 51.5117, lng: -0.0566, type: 'tube_station' },
  { id: 'wapping', name: 'Wapping', lat: 51.5043, lng: -0.0559, type: 'tube_station' },
  { id: 'rotherhithe', name: 'Rotherhithe', lat: 51.5010, lng: -0.0525, type: 'tube_station' },
  { id: 'surrey-quays', name: 'Surrey Quays', lat: 51.4933, lng: -0.0478, type: 'tube_station' },
  { id: 'new-cross', name: 'New Cross', lat: 51.4767, lng: -0.0325, type: 'rail_station' },
  { id: 'new-cross-gate', name: 'New Cross Gate', lat: 51.4753, lng: -0.0404, type: 'rail_station' },
  { id: 'peckham-rye', name: 'Peckham Rye', lat: 51.4700, lng: -0.0693, type: 'rail_station' },
  { id: 'denmark-hill', name: 'Denmark Hill', lat: 51.4684, lng: -0.0889, type: 'rail_station' },
  { id: 'clapham-junction', name: 'Clapham Junction', lat: 51.4641, lng: -0.1703, type: 'rail_station' },
  { id: 'crystal-palace', name: 'Crystal Palace', lat: 51.4184, lng: -0.0726, type: 'rail_station' },
  { id: 'forest-hill', name: 'Forest Hill', lat: 51.4393, lng: -0.0536, type: 'rail_station' },
  { id: 'brockley', name: 'Brockley', lat: 51.4642, lng: -0.0371, type: 'rail_station' },
  { id: 'honor-oak-park', name: 'Honor Oak Park', lat: 51.4500, lng: -0.0453, type: 'rail_station' },

  // DLR
  { id: 'greenwich', name: 'Greenwich', lat: 51.4781, lng: -0.0149, type: 'rail_station' },
  { id: 'deptford-bridge', name: 'Deptford Bridge', lat: 51.4740, lng: -0.0219, type: 'rail_station' },
  { id: 'lewisham', name: 'Lewisham', lat: 51.4657, lng: -0.0142, type: 'rail_station' },
  { id: 'cutty-sark', name: 'Cutty Sark', lat: 51.4827, lng: -0.0101, type: 'rail_station' },
  { id: 'island-gardens', name: 'Island Gardens', lat: 51.4871, lng: -0.0095, type: 'rail_station' },
  { id: 'limehouse', name: 'Limehouse', lat: 51.5123, lng: -0.0396, type: 'rail_station' },
  { id: 'bow-church', name: 'Bow Church', lat: 51.5269, lng: -0.0208, type: 'rail_station' },
  { id: 'poplar', name: 'Poplar', lat: 51.5077, lng: -0.0173, type: 'rail_station' },
  { id: 'canning-town', name: 'Canning Town', lat: 51.5147, lng: 0.0083, type: 'tube_station' },
  { id: 'royal-victoria', name: 'Royal Victoria', lat: 51.5091, lng: 0.0181, type: 'rail_station' },
  { id: 'custom-house', name: 'Custom House', lat: 51.5095, lng: 0.0276, type: 'rail_station' },
  { id: 'woolwich-arsenal', name: 'Woolwich Arsenal', lat: 51.4905, lng: 0.0691, type: 'rail_station' },

  // South London (sparser tube coverage)
  { id: 'brixton-rail', name: 'Herne Hill', lat: 51.4545, lng: -0.0924, type: 'rail_station' },
  { id: 'tulse-hill', name: 'Tulse Hill', lat: 51.4398, lng: -0.1038, type: 'rail_station' },
  { id: 'streatham', name: 'Streatham', lat: 51.4254, lng: -0.1310, type: 'rail_station' },
  { id: 'norwood-junction', name: 'Norwood Junction', lat: 51.3970, lng: -0.0750, type: 'rail_station' },
  { id: 'east-dulwich', name: 'East Dulwich', lat: 51.4614, lng: -0.0817, type: 'rail_station' },
  { id: 'south-bermondsey', name: 'South Bermondsey', lat: 51.4877, lng: -0.0534, type: 'rail_station' },
  { id: 'catford', name: 'Catford', lat: 51.4445, lng: -0.0251, type: 'rail_station' },
  { id: 'sydenham', name: 'Sydenham', lat: 51.4272, lng: -0.0548, type: 'rail_station' },

  // West London
  { id: 'chiswick-park', name: 'Chiswick Park', lat: 51.4946, lng: -0.2678, type: 'tube_station' },
  { id: 'gunnersbury', name: 'Gunnersbury', lat: 51.4915, lng: -0.2752, type: 'tube_station' },
  { id: 'kew-gardens', name: 'Kew Gardens', lat: 51.4770, lng: -0.2854, type: 'tube_station' },
  { id: 'richmond', name: 'Richmond', lat: 51.4631, lng: -0.3013, type: 'tube_station' },

  // North West
  { id: 'golders-green', name: 'Golders Green', lat: 51.5724, lng: -0.1941, type: 'tube_station' },
  { id: 'brent-cross', name: 'Brent Cross', lat: 51.5766, lng: -0.2136, type: 'tube_station' },
  { id: 'hendon-central', name: 'Hendon Central', lat: 51.5832, lng: -0.2268, type: 'tube_station' },
  { id: 'colindale', name: 'Colindale', lat: 51.5955, lng: -0.2498, type: 'tube_station' },
  { id: 'edgware', name: 'Edgware', lat: 51.6137, lng: -0.2750, type: 'tube_station' },
  { id: 'belsize-park', name: 'Belsize Park', lat: 51.5504, lng: -0.1642, type: 'tube_station' },
  { id: 'hampstead', name: 'Hampstead', lat: 51.5568, lng: -0.1780, type: 'tube_station' },

  // Metropolitan Line
  { id: 'harrow-on-the-hill', name: 'Harrow-on-the-Hill', lat: 51.5793, lng: -0.3370, type: 'tube_station' },
  { id: 'northwick-park', name: 'Northwick Park', lat: 51.5784, lng: -0.3184, type: 'tube_station' },
  { id: 'wembley-park', name: 'Wembley Park', lat: 51.5635, lng: -0.2795, type: 'tube_station' },
  { id: 'neasden', name: 'Neasden', lat: 51.5543, lng: -0.2503, type: 'tube_station' },
  { id: 'dollis-hill', name: 'Dollis Hill', lat: 51.5520, lng: -0.2387, type: 'tube_station' },

  // Additional TfL stations (tube, DLR, Overground, Elizabeth line) within 15km of centre
  { id: 'tfl-acton-central', name: 'Acton Central', lat: 51.50862, lng: -0.26351, type: 'tube_station' },
  { id: 'tfl-anerley', name: 'Anerley', lat: 51.41221, lng: -0.06544, type: 'tube_station' },
  { id: 'tfl-blackhorse-rd', name: 'Blackhorse Road', lat: 51.58699, lng: -0.04058, type: 'tube_station' },
  { id: 'tfl-bruce-grove', name: 'Bruce Grove', lat: 51.59411, lng: -0.06983, type: 'tube_station' },
  { id: 'tfl-cambridge-heath', name: 'Cambridge Heath', lat: 51.53238, lng: -0.05723, type: 'tube_station' },
  { id: 'tfl-clapton', name: 'Clapton', lat: 51.56145, lng: -0.05721, type: 'tube_station' },
  { id: 'tfl-caledonian-road-barnsbury', name: 'Caledonian Road & Barnsbury', lat: 51.54317, lng: -0.11563, type: 'tube_station' },
  { id: 'tfl-clapham-high-street', name: 'Clapham High Street', lat: 51.46508, lng: -0.13199, type: 'tube_station' },
  { id: 'tfl-canonbury', name: 'Canonbury', lat: 51.54872, lng: -0.09195, type: 'tube_station' },
  { id: 'tfl-crouch-hill', name: 'Crouch Hill', lat: 51.57116, lng: -0.11714, type: 'tube_station' },
  { id: 'tfl-imperial-wharf', name: 'Imperial Wharf', lat: 51.47481, lng: -0.18274, type: 'tube_station' },
  { id: 'tfl-edmonton-green', name: 'Edmonton Green', lat: 51.62492, lng: -0.06087, type: 'tube_station' },
  { id: 'tfl-finchley-road-frognal', name: 'Finchley Road & Frognal', lat: 51.5502, lng: -0.1828, type: 'tube_station' },
  { id: 'tfl-gospel-oak', name: 'Gospel Oak', lat: 51.55511, lng: -0.151, type: 'tube_station' },
  { id: 'tfl-hackney-wick', name: 'Hackney Wick', lat: 51.54317, lng: -0.02542, type: 'tube_station' },
  { id: 'tfl-highams-park', name: 'Highams Park', lat: 51.60835, lng: -0.00021, type: 'tube_station' },
  { id: 'tfl-hoxton', name: 'Hoxton', lat: 51.53103, lng: -0.07589, type: 'tube_station' },
  { id: 'tfl-kensington-olympia', name: 'Kensington Olympia', lat: 51.49776, lng: -0.2105, type: 'tube_station' },
  { id: 'tfl-kensal-rise', name: 'Kensal Rise', lat: 51.53437, lng: -0.21995, type: 'tube_station' },
  { id: 'tfl-kentish-town-west', name: 'Kentish Town West', lat: 51.54643, lng: -0.14652, type: 'tube_station' },
  { id: 'tfl-leyton-midland-road', name: 'Leyton Midland Road', lat: 51.56982, lng: -0.0079, type: 'tube_station' },
  { id: 'tfl-london-fields', name: 'London Fields', lat: 51.54103, lng: -0.05779, type: 'tube_station' },
  { id: 'tfl-leytonstone-high-road', name: 'Leytonstone High Road', lat: 51.56333, lng: 0.00857, type: 'tube_station' },
  { id: 'tfl-north-wembley', name: 'North Wembley', lat: 51.56283, lng: -0.30399, type: 'tube_station' },
  { id: 'tfl-queens-road-peckham', name: "Queen's Road Peckham", lat: 51.47382, lng: -0.05739, type: 'tube_station' },
  { id: 'tfl-penge-west', name: 'Penge West', lat: 51.41767, lng: -0.06112, type: 'tube_station' },
  { id: 'tfl-rectory-road', name: 'Rectory Road', lat: 51.55857, lng: -0.06857, type: 'tube_station' },
  { id: 'tfl-south-acton', name: 'South Acton', lat: 51.49923, lng: -0.27035, type: 'tube_station' },
  { id: 'tfl-silver-street', name: 'Silver Street', lat: 51.61474, lng: -0.06719, type: 'tube_station' },
  { id: 'tfl-south-kenton', name: 'South Kenton', lat: 51.57071, lng: -0.30909, type: 'tube_station' },
  { id: 'tfl-st-james-street', name: "St James's Street", lat: 51.58106, lng: -0.03316, type: 'tube_station' },
  { id: 'tfl-stoke-newington', name: 'Stoke Newington', lat: 51.56532, lng: -0.07311, type: 'tube_station' },
  { id: 'tfl-west-croydon', name: 'West Croydon', lat: 51.37809, lng: -0.10277, type: 'tube_station' },
  { id: 'tfl-woodgrange-park', name: 'Woodgrange Park', lat: 51.5494, lng: 0.044, type: 'tube_station' },
  { id: 'tfl-wood-street', name: 'Wood Street', lat: 51.58645, lng: -0.00261, type: 'tube_station' },
  { id: 'tfl-white-hart-lane', name: 'White Hart Lane', lat: 51.60533, lng: -0.071, type: 'tube_station' },
  { id: 'tfl-west-hampstead-overground', name: 'West Hampstead Overground', lat: 51.54747, lng: -0.19116, type: 'tube_station' },
  { id: 'tfl-wanstead-park', name: 'Wanstead Park', lat: 51.55191, lng: 0.02523, type: 'tube_station' },
  { id: 'tfl-all-saints', name: 'All Saints', lat: 51.51113, lng: -0.01291, type: 'tube_station' },
  { id: 'tfl-blackwall', name: 'Blackwall', lat: 51.50812, lng: -0.00656, type: 'tube_station' },
  { id: 'tfl-beckton', name: 'Beckton', lat: 51.51432, lng: 0.06064, type: 'tube_station' },
  { id: 'tfl-beckton-park', name: 'Beckton Park', lat: 51.50927, lng: 0.05485, type: 'tube_station' },
  { id: 'tfl-crossharbour', name: 'Crossharbour', lat: 51.49603, lng: -0.0142, type: 'tube_station' },
  { id: 'tfl-cyprus', name: 'Cyprus', lat: 51.50882, lng: 0.06357, type: 'tube_station' },
  { id: 'tfl-east-india', name: 'East India', lat: 51.50944, lng: -0.00263, type: 'tube_station' },
  { id: 'tfl-gallions-reach', name: 'Gallions Reach', lat: 51.50875, lng: 0.07196, type: 'tube_station' },
  { id: 'tfl-king-george-v', name: 'King George V', lat: 51.50194, lng: 0.06177, type: 'tube_station' },
  { id: 'tfl-london-city-airport', name: 'London City Airport', lat: 51.50329, lng: 0.0498, type: 'tube_station' },
  { id: 'tfl-mudchute', name: 'Mudchute', lat: 51.49118, lng: -0.01469, type: 'tube_station' },
  { id: 'tfl-pudding-mill-lane', name: 'Pudding Mill Lane', lat: 51.53401, lng: -0.0131, type: 'tube_station' },
  { id: 'tfl-royal-albert', name: 'Royal Albert', lat: 51.50809, lng: 0.04572, type: 'tube_station' },
  { id: 'tfl-stratford-international', name: 'Stratford International', lat: 51.5456, lng: -0.00841, type: 'tube_station' },
  { id: 'tfl-south-quay', name: 'South Quay', lat: 51.50013, lng: -0.01658, type: 'tube_station' },
  { id: 'tfl-westferry', name: 'Westferry', lat: 51.50942, lng: -0.02661, type: 'tube_station' },
  { id: 'tfl-west-silvertown', name: 'West Silvertown', lat: 51.50285, lng: 0.02275, type: 'tube_station' },
  { id: 'tfl-arnos-grove', name: 'Arnos Grove', lat: 51.61606, lng: -0.1334, type: 'tube_station' },
  { id: 'tfl-bromley-by-bow', name: 'Bromley-by-Bow', lat: 51.52473, lng: -0.01144, type: 'tube_station' },
  { id: 'tfl-bounds-green', name: 'Bounds Green', lat: 51.60693, lng: -0.12456, type: 'tube_station' },
  { id: 'tfl-boston-manor', name: 'Boston Manor', lat: 51.49585, lng: -0.32446, type: 'tube_station' },
  { id: 'tfl-burnt-oak', name: 'Burnt Oak', lat: 51.60259, lng: -0.26398, type: 'tube_station' },
  { id: 'tfl-colliers-wood', name: 'Colliers Wood', lat: 51.41805, lng: -0.17819, type: 'tube_station' },
  { id: 'tfl-finchley-road', name: 'Finchley Road', lat: 51.54688, lng: -0.17976, type: 'tube_station' },
  { id: 'tfl-goldhawk-road', name: 'Goldhawk Road', lat: 51.50193, lng: -0.22731, type: 'tube_station' },
  { id: 'tfl-hanger-lane', name: 'Hanger Lane', lat: 51.53013, lng: -0.29275, type: 'tube_station' },
  { id: 'tfl-kingsbury', name: 'Kingsbury', lat: 51.58498, lng: -0.2787, type: 'tube_station' },
  { id: 'tfl-kilburn-park', name: 'Kilburn Park', lat: 51.53505, lng: -0.19358, type: 'tube_station' },
  { id: 'tfl-ladbroke-grove', name: 'Ladbroke Grove', lat: 51.51742, lng: -0.21007, type: 'tube_station' },
  { id: 'tfl-latimer-road', name: 'Latimer Road', lat: 51.5137, lng: -0.21763, type: 'tube_station' },
  { id: 'tfl-mill-hill-east', name: 'Mill Hill East', lat: 51.60827, lng: -0.20977, type: 'tube_station' },
  { id: 'tfl-mornington-crescent', name: 'Mornington Crescent', lat: 51.53413, lng: -0.13913, type: 'tube_station' },
  { id: 'tfl-north-ealing', name: 'North Ealing', lat: 51.51755, lng: -0.28915, type: 'tube_station' },
  { id: 'tfl-northfields', name: 'Northfields', lat: 51.49927, lng: -0.31455, type: 'tube_station' },
  { id: 'tfl-park-royal', name: 'Park Royal', lat: 51.52707, lng: -0.28417, type: 'tube_station' },
  { id: 'tfl-preston-road', name: 'Preston Road', lat: 51.57178, lng: -0.29487, type: 'tube_station' },
  { id: 'tfl-perivale', name: 'Perivale', lat: 51.53677, lng: -0.32401, type: 'tube_station' },
  { id: 'tfl-queensbury', name: 'Queensbury', lat: 51.5941, lng: -0.28552, type: 'tube_station' },
  { id: 'tfl-redbridge', name: 'Redbridge', lat: 51.57628, lng: 0.04556, type: 'tube_station' },
  { id: 'tfl-regents-park', name: "Regent's Park", lat: 51.52359, lng: -0.14671, type: 'tube_station' },
  { id: 'tfl-ravenscourt-park', name: 'Ravenscourt Park', lat: 51.49406, lng: -0.23656, type: 'tube_station' },
  { id: 'tfl-royal-oak', name: 'Royal Oak', lat: 51.51911, lng: -0.18878, type: 'tube_station' },
  { id: 'tfl-shepherds-bush-market', name: "Shepherd's Bush Market", lat: 51.5057, lng: -0.22627, type: 'tube_station' },
  { id: 'tfl-south-ealing', name: 'South Ealing', lat: 51.50138, lng: -0.30685, type: 'tube_station' },
  { id: 'tfl-stamford-brook', name: 'Stamford Brook', lat: 51.49499, lng: -0.24678, type: 'tube_station' },
  { id: 'tfl-southgate', name: 'Southgate', lat: 51.63232, lng: -0.12806, type: 'tube_station' },
  { id: 'tfl-st-james-park', name: "St James's Park", lat: 51.49962, lng: -0.13313, type: 'tube_station' },
  { id: 'tfl-snaresbrook', name: 'Snaresbrook', lat: 51.58103, lng: 0.02143, type: 'tube_station' },
  { id: 'tfl-sudbury-town', name: 'Sudbury Town', lat: 51.55037, lng: -0.31592, type: 'tube_station' },
  { id: 'tfl-south-woodford', name: 'South Woodford', lat: 51.59193, lng: 0.02769, type: 'tube_station' },
  { id: 'tfl-south-wimbledon', name: 'South Wimbledon', lat: 51.41527, lng: -0.19251, type: 'tube_station' },
  { id: 'tfl-totteridge-whetstone', name: 'Totteridge & Whetstone', lat: 51.63018, lng: -0.17928, type: 'tube_station' },
  { id: 'tfl-upton-park', name: 'Upton Park', lat: 51.53548, lng: 0.03521, type: 'tube_station' },
  { id: 'tfl-west-finchley', name: 'West Finchley', lat: 51.60958, lng: -0.18863, type: 'tube_station' },
  { id: 'tfl-willesden-green', name: 'Willesden Green', lat: 51.54924, lng: -0.22094, type: 'tube_station' },
  { id: 'tfl-woodside-park', name: 'Woodside Park', lat: 51.61795, lng: -0.18516, type: 'tube_station' },
  { id: 'tfl-wanstead', name: 'Wanstead', lat: 51.57559, lng: 0.02832, type: 'tube_station' },
  { id: 'tfl-westbourne-park', name: 'Westbourne Park', lat: 51.5209, lng: -0.20067, type: 'tube_station' },
  { id: 'tfl-west-acton', name: 'West Acton', lat: 51.51789, lng: -0.28108, type: 'tube_station' },
  { id: 'tfl-acton-main-line', name: 'Acton Main Line', lat: 51.516747, lng: -0.269684, type: 'tube_station' },
  { id: 'tfl-ealing-broadway', name: 'Ealing Broadway', lat: 51.514643, lng: -0.30173, type: 'tube_station' },
  { id: 'tfl-forest-gate', name: 'Forest Gate', lat: 51.549297, lng: 0.023842, type: 'tube_station' },
  { id: 'tfl-hanwell', name: 'Hanwell', lat: 51.511888, lng: -0.338524, type: 'tube_station' },
  { id: 'tfl-manor-park', name: 'Manor Park', lat: 51.552291, lng: 0.045107, type: 'tube_station' },
  { id: 'tfl-maryland', name: 'Maryland', lat: 51.545937, lng: 0.005852, type: 'tube_station' },
  { id: 'tfl-west-ealing', name: 'West Ealing', lat: 51.513411, lng: -0.322313, type: 'tube_station' },
  { id: 'tfl-camden-road', name: 'Camden Road', lat: 51.541791, lng: -0.138701, type: 'tube_station' },
  { id: 'tfl-hampstead-heath', name: 'Hampstead Heath', lat: 51.55521, lng: -0.165705, type: 'tube_station' },
  { id: 'tfl-battersea-power', name: 'Battersea Power Station', lat: 51.479932, lng: -0.142142, type: 'tube_station' },
  { id: 'tfl-langdon-park', name: 'Langdon Park', lat: 51.515172, lng: -0.01415, type: 'tube_station' },
  { id: 'tfl-pontoon-dock', name: 'Pontoon Dock', lat: 51.502212, lng: 0.032115, type: 'tube_station' },
  { id: 'tfl-west-kensington', name: 'West Kensington', lat: 51.490459, lng: -0.206636, type: 'tube_station' },
  { id: 'tfl-nine-elms', name: 'Nine Elms', lat: 51.479912, lng: -0.128476, type: 'tube_station' },
];

// London bounding box for grid generation
const BOUNDS = {
  minLat: 51.35,
  maxLat: 51.65,
  minLng: -0.40,
  maxLng: 0.20,
};

const GRID_SPACING_KM = 3;
const MIN_DISTANCE_FROM_STATION_KM = 0.5;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function generateGridPoints(): SamplePoint[] {
  // ~0.018 degrees lat per km, ~0.028 degrees lng per km at London's latitude
  const latStep = GRID_SPACING_KM * 0.009;
  const lngStep = GRID_SPACING_KM * 0.014;
  const points: SamplePoint[] = [];

  for (let lat = BOUNDS.minLat; lat <= BOUNDS.maxLat; lat += latStep) {
    for (let lng = BOUNDS.minLng; lng <= BOUNDS.maxLng; lng += lngStep) {
      const tooClose = STATIONS.some(
        (s) => haversineKm(lat, lng, s.lat, s.lng) < MIN_DISTANCE_FROM_STATION_KM
      );
      if (!tooClose) {
        points.push({
          id: `grid-${lat.toFixed(3)}-${lng.toFixed(3)}`,
          name: `Grid ${lat.toFixed(3)}, ${lng.toFixed(3)}`,
          lat: parseFloat(lat.toFixed(5)),
          lng: parseFloat(lng.toFixed(5)),
          type: 'grid',
        });
      }
    }
  }

  return points;
}

export function getSamplePoints(): SamplePoint[] {
  return [...STATIONS, ...generateGridPoints()];
}
