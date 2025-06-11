import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Filter,
  Star,
  StarOff,
  Building2,
  Coins,
  DollarSign,
  BarChart3,
  Zap,
  Activity,
  Upload
} from 'lucide-react';
import { useTradingData } from '../../hooks/useTradingData';
import { Asset } from '../../types';

const assetCategories = [
  { value: 'stocks', label: 'Stocks', icon: TrendingUp, color: 'bg-blue-500' },
  { value: 'crypto', label: 'Crypto', icon: Coins, color: 'bg-orange-500' },
  { value: 'forex', label: 'Forex', icon: DollarSign, color: 'bg-green-500' },
  { value: 'commodities', label: 'Commodities', icon: BarChart3, color: 'bg-yellow-500' },
  { value: 'indices', label: 'Indices', icon: Activity, color: 'bg-purple-500' },
  { value: 'options', label: 'Options', icon: Zap, color: 'bg-red-500' },
];

const popularAssets = {
  stocks: ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA', 'META', 'NFLX'],
  crypto: ['BTC', 'ETH', 'ADA', 'SOL', 'DOGE', 'MATIC', 'AVAX', 'DOT'],
  forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD'],
  commodities: ['GOLD', 'SILVER', 'OIL', 'NATGAS', 'WHEAT', 'CORN'],
  indices: ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VOO'],
  options: ['SPY Calls', 'QQQ Puts', 'TSLA Calls', 'AAPL Puts'],
};

// Indian stock data from CSV
const indianStocks = [
  { symbol: 'HINDPETRO', name: 'Hindustan Petroleum Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'OIL', name: 'Oil India Limited', sector: 'Oil & Gas' },
  { symbol: 'PHOENIXLTD', name: 'The Phoenix Mills Limited', sector: 'Real Estate' },
  { symbol: 'ABCAPITAL', name: 'Aditya Birla Capital Ltd', sector: 'Financial Services' },
  { symbol: 'IOC', name: 'Indian Oil Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'HEROMOTOCO', name: 'Hero Motocorp Limited', sector: 'Automobile' },
  { symbol: 'MANKIND', name: 'Mankind Pharma Ltd', sector: 'Pharmaceuticals' },
  { symbol: 'TVSMOTOR', name: 'Tvs Motor Company Limited', sector: 'Automobile' },
  { symbol: 'LAURUSLABS', name: 'Laurus Labs Limited', sector: 'Pharmaceuticals' },
  { symbol: 'COALINDIA', name: 'Coal India Limited', sector: 'Mining' },
  { symbol: 'ABFRL', name: 'Aditya Birla Fashion And Retail Limited', sector: 'Consumer Goods' },
  { symbol: 'RELIANCE', name: 'Reliance Industries Limited', sector: 'Oil & Gas' },
  { symbol: 'AUBANK', name: 'AU Small Finance Bank', sector: 'Banking' },
  { symbol: 'NHPC', name: 'Nhpc Limited', sector: 'Power' },
  { symbol: 'HFCL', name: 'Himachal Futuristic Communications Limited', sector: 'Telecommunications' },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Limited', sector: 'Financial Services' },
  { symbol: 'GAIL', name: 'Gail (india) Limited', sector: 'Oil & Gas' },
  { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Limited', sector: 'Pharmaceuticals' },
  { symbol: 'AARTIIND', name: 'Aarti Industries Limited', sector: 'Chemicals' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Limited', sector: 'Automobile' },
  { symbol: 'JSWENERGY', name: 'Jsw Energy Limited', sector: 'Power' },
  { symbol: 'IIFL', name: 'Iifl Holdings Limited', sector: 'Financial Services' },
  { symbol: 'PETRONET', name: 'Petronet Lng Limited', sector: 'Oil & Gas' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Limited', sector: 'Automobile' },
  { symbol: 'MARICO', name: 'Marico Limited', sector: 'Consumer Goods' },
  { symbol: 'SHREECEM', name: 'Shree Cements Limited', sector: 'Cement' },
  { symbol: 'SONACOMS', name: 'Sona BLW Precision Forgings Ltd', sector: 'Automobile' },
  { symbol: 'LICHSGFIN', name: 'Lic Housing Finance Limited', sector: 'Financial Services' },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products Limited', sector: 'Consumer Goods' },
  { symbol: 'POLYCAB', name: 'Polycab India Ltd', sector: 'Electrical Equipment' },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Limited', sector: 'Oil & Gas' },
  { symbol: 'IEX', name: 'Indian Energy Exchange Ltd', sector: 'Power' },
  { symbol: 'IRFC', name: 'Indian Railway Finance Corporation Ltd', sector: 'Financial Services' },
  { symbol: 'SJVN', name: 'Sjvn Limited', sector: 'Power' },
  { symbol: 'IDEA', name: 'Idea Cellular Limited', sector: 'Telecommunications' },
  { symbol: 'JSWSTEEL', name: 'Jsw Steel Limited', sector: 'Metals' },
  { symbol: 'ULTRACEMCO', name: 'Ultratech Cement Limited', sector: 'Cement' },
  { symbol: 'MAXHEALTH', name: 'Max Healthcare Institute Ltd', sector: 'Healthcare' },
  { symbol: 'CAMS', name: 'Computer Age Management Services Ltd', sector: 'Financial Services' },
  { symbol: 'EXIDEIND', name: 'Exide Industries Limited', sector: 'Automobile' },
  { symbol: 'PAGEIND', name: 'Page Industries Limited', sector: 'Textiles' },
  { symbol: 'RVNL', name: 'Rail Vikas Nigam Ltd', sector: 'Infrastructure' },
  { symbol: 'KEI', name: 'Kei Industries Limited', sector: 'Electrical Equipment' },
  { symbol: 'NTPC', name: 'Ntpc Limited', sector: 'Power' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Limited', sector: 'Metals' },
  { symbol: 'HDFCAMC', name: 'HDFC Asset Management Company Ltd', sector: 'Financial Services' },
  { symbol: 'DLF', name: 'Dlf Limited', sector: 'Real Estate' },
  { symbol: 'IRCTC', name: 'Indian Railway Catering & Tourism Corporation Ltd', sector: 'Consumer Services' },
  { symbol: 'POONAWALLA', name: 'Poonawalla Fincorp Ltd', sector: 'Financial Services' },
  { symbol: 'MFSL', name: 'Max Financial Services Limited', sector: 'Financial Services' },
  { symbol: 'LODHA', name: 'Macrotech Developers Ltd', sector: 'Real Estate' },
  { symbol: 'BIOCON', name: 'Biocon Limited', sector: 'Pharmaceuticals' },
  { symbol: 'ETERNAL', name: 'Eternal Ltd', sector: 'Chemicals' },
  { symbol: 'PFC', name: 'Power Finance Corporation Limited', sector: 'Financial Services' },
  { symbol: 'CIPLA', name: 'Cipla Limited', sector: 'Pharmaceuticals' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd', sector: 'Financial Services' },
  { symbol: 'BALKRISIND', name: 'Balkrishna Industries Limited', sector: 'Automobile' },
  { symbol: 'HINDCOPPER', name: 'Hindustan Copper Limited', sector: 'Metals' },
  { symbol: 'GRASIM', name: 'Grasim Industries Limited', sector: 'Cement' },
  { symbol: 'ASTRAL', name: 'Astral Poly Technik Limited', sector: 'Building Materials' },
  { symbol: 'BOSCHLTD', name: 'Bosch Limited', sector: 'Automobile' },
  { symbol: 'ZYDUSLIFE', name: 'Zydus Lifesciences Ltd', sector: 'Pharmaceuticals' },
  { symbol: 'HAVELLS', name: 'Havells India Limited', sector: 'Electrical Equipment' },
  { symbol: 'ICICIPRULI', name: 'Icici Prudential Life Insurance Company Limited', sector: 'Financial Services' },
  { symbol: 'VEDL', name: 'Vedanta Limited', sector: 'Metals' },
  { symbol: 'ICICIBANK', name: 'Icici Bank Limited', sector: 'Banking' },
  { symbol: 'DABUR', name: 'Dabur India Limited', sector: 'Consumer Goods' },
  { symbol: 'M&MFIN', name: 'Mahindra & Mahindra Financial Services Limited', sector: 'Financial Services' },
  { symbol: 'HCLTECH', name: 'Hcl Technologies Limited', sector: 'IT Services' },
  { symbol: 'DMART', name: 'Avenue Supermarts', sector: 'Consumer Services' },
  { symbol: 'AMBUJACEM', name: 'Ambuja Cements Limited', sector: 'Cement' },
  { symbol: 'CHAMBLFERT', name: 'Chambal Fertilizers & Chemicals Limited', sector: 'Fertilizers' },
  { symbol: 'SYNGENE', name: 'Syngene International Limited', sector: 'Pharmaceuticals' },
  { symbol: 'RECLTD', name: 'Rural Electrification Corporation Limited', sector: 'Financial Services' },
  { symbol: 'BANDHANBNK', name: 'Bandhan Bank Ltd', sector: 'Banking' },
  { symbol: 'APLAPOLLO', name: 'Apl Apollo Tubes Limited', sector: 'Metals' },
  { symbol: 'SAIL', name: 'Steel Authority Of India Limited', sector: 'Metals' },
  { symbol: 'RBLBANK', name: 'Rbl Bank Limited', sector: 'Banking' },
  { symbol: 'GMRAIRPORT', name: 'GMR Airports Ltd', sector: 'Infrastructure' },
  { symbol: 'GLENMARK', name: 'Glenmark Pharmaceuticals Limited', sector: 'Pharmaceuticals' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited', sector: 'Financial Services' },
  { symbol: 'PAYTM', name: 'One 97 Communications Ltd', sector: 'Financial Services' },
  { symbol: 'ADANIENSOL', name: 'Adani Energy Solutions Ltd', sector: 'Power' },
  { symbol: 'SBIN', name: 'State Bank Of India', sector: 'Banking' },
  { symbol: 'PIIND', name: 'Pi Industries Limited', sector: 'Chemicals' },
  { symbol: 'NBCC', name: 'Nbcc (india) Limited', sector: 'Infrastructure' },
  { symbol: 'LICI', name: 'Life Insurance Corporation of India', sector: 'Financial Services' },
  { symbol: 'TATAPOWER', name: 'Tata Power Company Limited', sector: 'Power' },
  { symbol: 'TECHM', name: 'Tech Mahindra Limited', sector: 'IT Services' },
  { symbol: 'CESC', name: 'Cesc Limited', sector: 'Power' },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Limited', sector: 'Consumer Goods' },
  { symbol: 'PRESTIGE', name: 'Prestige Estates Projects Limited', sector: 'Real Estate' },
  { symbol: 'NIFTY', name: 'NIFTY', sector: 'Index' },
  { symbol: 'CONCOR', name: 'Container Corporation Of India Limited', sector: 'Logistics' },
  { symbol: 'MANAPPURAM', name: 'Manappuram Finance Limited', sector: 'Financial Services' },
  { symbol: 'PEL', name: 'Piramal Enterprises Limited', sector: 'Pharmaceuticals' },
  { symbol: 'TORNTPOWER', name: 'Torrent Power Limited', sector: 'Power' },
  { symbol: 'TATACHEM', name: 'Tata Chemicals Limited', sector: 'Chemicals' },
  { symbol: 'TATATECH', name: 'Tata Technologies Ltd', sector: 'IT Services' },
  { symbol: 'MGL', name: 'Mahanagar Gas Limited', sector: 'Oil & Gas' },
  { symbol: 'LT', name: 'Larsen & Toubro Limited', sector: 'Infrastructure' },
  { symbol: 'LUPIN', name: 'Lupin Limited', sector: 'Pharmaceuticals' },
  { symbol: 'ACC', name: 'Acc Limited', sector: 'Cement' },
  { symbol: 'IGL', name: 'Indraprastha Gas Limited', sector: 'Oil & Gas' },
  { symbol: 'NMDC', name: 'Nmdc Limited', sector: 'Mining' },
  { symbol: 'INDHOTEL', name: 'The Indian Hotels Company Limited', sector: 'Consumer Services' },
  { symbol: 'INFY', name: 'Infosys Limited', sector: 'IT Services' },
  { symbol: 'IREDA', name: 'Indian Renewable Energy Development Agency Ltd', sector: 'Financial Services' },
  { symbol: 'AXISBANK', name: 'Axis Bank Limited', sector: 'Banking' },
  { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance Limited', sector: 'Financial Services' },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd', sector: 'Financial Services' },
  { symbol: 'BLUESTARCO', name: 'Blue Star Limited', sector: 'Consumer Durables' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Limited', sector: 'Automobile' },
  { symbol: 'YESBANK', name: 'Yes Bank Limited', sector: 'Banking' },
  { symbol: 'INDIGO', name: 'Interglobe Aviation Limited', sector: 'Transportation' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Limited', sector: 'Automobile' },
  { symbol: 'CUMMINSIND', name: 'Cummins India Limited', sector: 'Automobile' },
  { symbol: 'BHARATFORG', name: 'Bharat Forge Limited', sector: 'Automobile' },
  { symbol: 'UNIONBANK', name: 'Union Bank Of India', sector: 'Banking' },
  { symbol: 'BANKNIFTY', name: 'BANKNIFTY', sector: 'Index' },
  { symbol: 'INDIANB', name: 'Indian Bank', sector: 'Banking' },
  { symbol: 'BSOFT', name: 'Birlasoft Ltd', sector: 'IT Services' },
  { symbol: 'ASHOKLEY', name: 'Ashok Leyland Limited', sector: 'Automobile' },
  { symbol: 'INDUSINDBK', name: 'Indusind Bank Limited', sector: 'Banking' },
  { symbol: 'WIPRO', name: 'Wipro Limited', sector: 'IT Services' },
  { symbol: 'HUDCO', name: 'Housing and Urban Development Corporation', sector: 'Financial Services' },
  { symbol: 'TRENT', name: 'Trent Limited', sector: 'Consumer Services' },
  { symbol: 'NCC', name: 'Ncc Limited', sector: 'Infrastructure' },
  { symbol: 'ALKEM', name: 'Alkem Laboratories Limited', sector: 'Pharmaceuticals' },
  { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Limited', sector: 'Pharmaceuticals' },
  { symbol: 'CNXMIDCAP', name: 'CNXMIDCAP', sector: 'Index' },
  { symbol: 'GRANULES', name: 'Granules India Limited', sector: 'Pharmaceuticals' },
  { symbol: 'ITC', name: 'Itc Limited', sector: 'Consumer Goods' },
  { symbol: 'CROMPTON', name: 'Crompton Greaves Consumer Electricals Limited', sector: 'Electrical Equipment' },
  { symbol: 'DELHIVERY', name: 'Delhivery Ltd', sector: 'Logistics' },
  { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd', sector: 'Banking' },
  { symbol: 'PPLPHARMA', name: 'Piramal Pharma Ltd', sector: 'Pharmaceuticals' },
  { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Ltd', sector: 'Consumer Services' },
  { symbol: 'MOTHERSON', name: 'Motherson Sumi Systems Limited', sector: 'Automobile' },
  { symbol: 'NESTLEIND', name: 'Nestle India Limited', sector: 'Consumer Goods' },
  { symbol: 'INOXWIND', name: 'Inox Wind Limited', sector: 'Power' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Limited', sector: 'IT Services' },
  { symbol: 'CANBK', name: 'Canara Bank', sector: 'Banking' },
  { symbol: 'JSL', name: 'Jindal Stainless Limited', sector: 'Metals' },
  { symbol: 'IRB', name: 'Irb Infrastructure Developers Limited', sector: 'Infrastructure' },
  { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd', sector: 'Aerospace & Defense' },
  { symbol: 'TITAN', name: 'Titan Company Limited', sector: 'Consumer Goods' },
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Limited', sector: 'Metals' },
  { symbol: 'GODREJPROP', name: 'Godrej Properties Limited', sector: 'Real Estate' },
  { symbol: 'PATANJALI', name: 'Patanjali Foods Ltd', sector: 'Consumer Goods' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Limited', sector: 'Banking' },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Limited', sector: 'Metals' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited', sector: 'Consumer Goods' },
  { symbol: 'ADANIGREEN', name: 'Adani Green Energy Ltd', sector: 'Power' },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Limited', sector: 'Healthcare' },
  { symbol: 'PNBHOUSING', name: 'Pnb Housing Finance Limited', sector: 'Financial Services' },
  { symbol: 'UNOMINDA', name: 'Uno Minda Ltd', sector: 'Automobile' },
  { symbol: 'MPHASIS', name: 'Mphasis Limited', sector: 'IT Services' },
  { symbol: 'HINDZINC', name: 'Hindustan Zinc Limited', sector: 'Metals' },
  { symbol: 'FEDERALBNK', name: 'The Federal Bank  Limited', sector: 'Banking' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Limited', sector: 'Chemicals' },
  { symbol: 'KAYNES', name: 'Kaynes Technology India Ltd', sector: 'Electronics' },
  { symbol: 'POLICYBZR', name: 'PB Fintech Ltd', sector: 'Financial Services' },
  { symbol: 'SBICARD', name: 'SBI Cards & Payment Services Ltd', sector: 'Financial Services' },
  { symbol: 'BEL', name: 'Bharat Electronics Limited', sector: 'Aerospace & Defense' },
  { symbol: 'INDUSTOWER', name: 'Indus Towers Ltd (Bharti Infratel)', sector: 'Telecommunications' },
  { symbol: 'LTIM', name: 'LTI Mindtree Ltd', sector: 'IT Services' },
  { symbol: 'DALBHARAT', name: 'Dalmia Bharat Limited', sector: 'Cement' },
  { symbol: 'HDFCBANK', name: 'Hdfc Bank Limited', sector: 'Banking' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited', sector: 'Telecommunications' },
  { symbol: 'BANKINDIA', name: 'Bank Of India', sector: 'Banking' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceuticals Industries Limited', sector: 'Pharmaceuticals' },
  { symbol: 'CHOLAFIN', name: 'Cholamandalam Investment And Finance Company Limited', sector: 'Financial Services' },
  { symbol: 'ANGELONE', name: 'Angel One Ltd', sector: 'Financial Services' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Limited', sector: 'Conglomerates' },
  { symbol: 'OBEROIRLTY', name: 'Oberoi Realty Limited', sector: 'Real Estate' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports And Special Economic Zone Limited', sector: 'Infrastructure' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Limited', sector: 'Automobile' },
  { symbol: 'JUBLFOOD', name: 'Jubilant Foodworks Limited', sector: 'Consumer Services' },
  { symbol: 'TITAGARH', name: 'Titagarh Rail Systems Ltd', sector: 'Infrastructure' },
  { symbol: 'SOLARINDS', name: 'Solar Industries India Limited', sector: 'Chemicals' },
  { symbol: 'PERSISTENT', name: 'Persistent Systems Limited', sector: 'IT Services' },
  { symbol: 'COLPAL', name: 'Colgate Palmolive (india) Limited', sector: 'Consumer Goods' },
  { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals Limited', sector: 'Pharmaceuticals' },
  { symbol: 'VOLTAS', name: 'Voltas Limited', sector: 'Consumer Durables' },
  { symbol: 'UPL', name: 'Upl Limited', sector: 'Chemicals' },
  { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma Limited', sector: 'Pharmaceuticals' },
  { symbol: 'TATACONSUM', name: 'TATA Consumer Products Ltd', sector: 'Consumer Goods' },
  { symbol: 'DIXON', name: 'Dixon Technologies', sector: 'Electronics' },
  { symbol: 'ATGL', name: 'Adani Total Gas Ltd', sector: 'Oil & Gas' },
  { symbol: 'COFORGE', name: 'Coforge (Niit Tech)', sector: 'IT Services' },
  { symbol: 'KPITTECH', name: 'KPIT Technologies Ltd', sector: 'IT Services' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation Of India Limited', sector: 'Power' },
  { symbol: 'TIINDIA', name: 'Tube Investments of India Ltd', sector: 'Automobile' },
  { symbol: 'VBL', name: 'Varun Beverages Limited', sector: 'Consumer Goods' },
  { symbol: 'CYIENT', name: 'Cyient Limited', sector: 'IT Services' },
  { symbol: 'BANKBARODA', name: 'Bank Of Baroda', sector: 'Banking' },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries Limited', sector: 'Chemicals' },
  { symbol: 'NAUKRI', name: 'Info Edge (india) Limited', sector: 'Consumer Services' },
  { symbol: 'PNB', name: 'Punjab National Bank', sector: 'Banking' },
  { symbol: 'JIOFIN', name: 'Jio Financial Services Ltd', sector: 'Financial Services' },
  { symbol: 'SRF', name: 'Srf Limited', sector: 'Chemicals' },
  { symbol: 'SHRIRAMFIN', name: 'Shriram Finance Ltd', sector: 'Financial Services' },
  { symbol: 'SIEMENS', name: 'Siemens Limited', sector: 'Industrial Manufacturing' },
  { symbol: 'LTF', name: 'L&T Finance Ltd', sector: 'Financial Services' },
  { symbol: 'CGPOWER', name: 'CG Power and Industrial Solutions Ltd', sector: 'Electrical Equipment' },
  { symbol: 'BHEL', name: 'Bharat Heavy Electricals Limited', sector: 'Electrical Equipment' },
  { symbol: 'SUPREMEIND', name: 'Supreme Industries Limited', sector: 'Chemicals' },
  { symbol: 'ICICIGI', name: 'ICICI Lombard General Insurance Company Ltd', sector: 'Financial Services' },
  { symbol: 'TATACOMM', name: 'Tata Communications Limited', sector: 'Telecommunications' },
  { symbol: 'NATIONALUM', name: 'National Aluminium Company Limited', sector: 'Metals' },
  { symbol: 'KALYANKJIL', name: 'Kalyan Jewellers India Ltd', sector: 'Consumer Goods' },
  { symbol: 'MAZDOCK', name: 'Mazagon Dock Shipbuilders Ltd', sector: 'Aerospace & Defense' },
  { symbol: 'FORTIS', name: 'Fortis Healthcare Limited', sector: 'Healthcare' },
  { symbol: 'ABB', name: 'Abb India Limited', sector: 'Industrial Manufacturing' },
  { symbol: 'TATAELXSI', name: 'Tata Elxsi Limited', sector: 'IT Services' },
  { symbol: 'BDL', name: 'Bharat Dynamics Ltd', sector: 'Aerospace & Defense' },
  { symbol: 'OFSS', name: 'Oracle Financial Services Software Limited', sector: 'IT Services' },
  { symbol: 'MCX', name: 'Multi Commodity Exchange Of India Limited', sector: 'Financial Services' },
  { symbol: 'CDSL', name: 'Central Depository Services Ltd', sector: 'Financial Services' },
  { symbol: 'BSE', name: 'BSE (Bombay stock exchange)', sector: 'Financial Services' },
  { symbol: 'UNITDSPR', name: 'United Spirits Ltd', sector: 'Consumer Goods' },
];

export function AssetManager() {
  const { assets, addAsset, updateAsset, deleteAsset } = useTradingData();
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isAddingIndianStocks, setIsAddingIndianStocks] = useState(false);
  
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    category: 'stocks' as Asset['category'],
    exchange: '',
    sector: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symbol || !formData.name) {
      alert('Please fill in symbol and name');
      return;
    }

    const assetData = {
      symbol: formData.symbol.toUpperCase(),
      name: formData.name,
      category: formData.category,
      exchange: formData.exchange,
      sector: formData.sector,
      isActive: true,
    };

    if (editingAsset) {
      updateAsset(editingAsset.id, assetData);
    } else {
      addAsset(assetData);
    }

    // Reset form
    setFormData({
      symbol: '',
      name: '',
      category: 'stocks',
      exchange: '',
      sector: '',
    });
    setShowForm(false);
    setEditingAsset(null);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      symbol: asset.symbol,
      name: asset.name,
      category: asset.category,
      exchange: asset.exchange || '',
      sector: asset.sector || '',
    });
    setShowForm(true);
  };

  const toggleFavorite = (asset: Asset) => {
    updateAsset(asset.id, { isActive: !asset.isActive });
  };

  const addPopularAsset = (symbol: string, category: Asset['category']) => {
    const assetData = {
      symbol: symbol,
      name: symbol,
      category: category,
      isActive: true,
    };
    addAsset(assetData);
  };

  const addAllIndianStocks = async () => {
    setIsAddingIndianStocks(true);
    
    try {
      // Check which stocks are already added
      const existingSymbols = new Set(assets.map(asset => asset.symbol.toUpperCase()));
      const stocksToAdd = indianStocks.filter(stock => !existingSymbols.has(stock.symbol.toUpperCase()));
      
      if (stocksToAdd.length === 0) {
        alert('All Indian stocks are already added to your assets!');
        setIsAddingIndianStocks(false);
        return;
      }

      // Add stocks in batches to avoid overwhelming the UI
      const batchSize = 20;
      for (let i = 0; i < stocksToAdd.length; i += batchSize) {
        const batch = stocksToAdd.slice(i, i + batchSize);
        
        batch.forEach(stock => {
          const assetData = {
            symbol: stock.symbol,
            name: stock.name,
            category: 'stocks' as Asset['category'],
            exchange: 'NSE',
            sector: stock.sector,
            isActive: false, // Don't mark all as favorites by default
          };
          addAsset(assetData);
        });
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      alert(`Successfully added ${stocksToAdd.length} Indian stocks to your assets!`);
    } catch (error) {
      console.error('Error adding Indian stocks:', error);
      alert('Error adding Indian stocks. Please try again.');
    } finally {
      setIsAddingIndianStocks(false);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesFavorites = !showFavorites || asset.isActive;
    
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const getCategoryInfo = (category: string) => {
    return assetCategories.find(cat => cat.value === category) || assetCategories[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Asset Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your trading assets for quick selection during trade entry
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={addAllIndianStocks}
            disabled={isAddingIndianStocks}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isAddingIndianStocks ? 'Adding...' : 'Add Indian Stocks'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Categories</option>
              {assetCategories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
            
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md transition-colors ${
                showFavorites
                  ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              {showFavorites ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Asset Form */}
      {showForm && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-medium text-gray-900">
              {editingAsset ? 'Edit Asset' : 'Add New Asset'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Symbol *</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., AAPL, BTC, EUR/USD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Apple Inc., Bitcoin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Asset['category'] }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {assetCategories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Exchange</label>
                <input
                  type="text"
                  value={formData.exchange}
                  onChange={(e) => setFormData(prev => ({ ...prev, exchange: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., NASDAQ, NYSE, NSE"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Sector</label>
                <input
                  type="text"
                  value={formData.sector}
                  onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Technology, Healthcare, Energy"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAsset(null);
                  setFormData({
                    symbol: '',
                    name: '',
                    category: 'stocks',
                    exchange: '',
                    sector: '',
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                {editingAsset ? 'Update Asset' : 'Add Asset'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Add Popular Assets */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Add Popular Assets</h3>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-4">
            {assetCategories.map(category => {
              const CategoryIcon = category.icon;
              return (
                <div key={category.value}>
                  <div className="flex items-center mb-2">
                    <div className={`p-1 rounded-md ${category.color} mr-2`}>
                      <CategoryIcon className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">{category.label}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularAssets[category.value as keyof typeof popularAssets]?.map(symbol => (
                      <button
                        key={symbol}
                        onClick={() => addPopularAsset(symbol, category.value as Asset['category'])}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        disabled={assets.some(asset => asset.symbol === symbol)}
                      >
                        {symbol}
                        {assets.some(asset => asset.symbol === symbol) ? (
                          <span className="ml-1 text-green-500">✓</span>
                        ) : (
                          <Plus className="ml-1 h-3 w-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Your Assets ({filteredAssets.length})</h3>
        </div>
        <div className="px-6 py-4">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedCategory !== 'all' || showFavorites
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first trading asset or use the "Add Indian Stocks" button'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.map((asset) => {
                const categoryInfo = getCategoryInfo(asset.category);
                const CategoryIcon = categoryInfo.icon;
                
                return (
                  <div key={asset.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-md ${categoryInfo.color} mr-3`}>
                          <CategoryIcon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{asset.symbol}</h4>
                          <p className="text-xs text-gray-500">{asset.name}</p>
                          {asset.exchange && (
                            <p className="text-xs text-gray-400">{asset.exchange}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleFavorite(asset)}
                          className={`p-1 rounded transition-colors ${
                            asset.isActive
                              ? 'text-yellow-500 hover:text-yellow-600'
                              : 'text-gray-400 hover:text-gray-500'
                          }`}
                        >
                          {asset.isActive ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(asset)}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryInfo.color} bg-opacity-10`}>
                        {categoryInfo.label}
                      </span>
                      {asset.sector && (
                        <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {asset.sector}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}