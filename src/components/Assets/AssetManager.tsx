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
  Upload,
  Flag,
  MapPin
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

// Indian stock data from CSV - organized by sectors
const indianStocksBySector = {
  'Oil & Gas': [
    { symbol: 'HINDPETRO', name: 'Hindustan Petroleum Corporation Limited' },
    { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Limited' },
    { symbol: 'OIL', name: 'Oil India Limited' },
    { symbol: 'IOC', name: 'Indian Oil Corporation Limited' },
    { symbol: 'RELIANCE', name: 'Reliance Industries Limited' },
    { symbol: 'GAIL', name: 'Gail (india) Limited' },
    { symbol: 'PETRONET', name: 'Petronet Lng Limited' },
    { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Limited' },
    { symbol: 'MGL', name: 'Mahanagar Gas Limited' },
    { symbol: 'IGL', name: 'Indraprastha Gas Limited' },
    { symbol: 'ATGL', name: 'Adani Total Gas Ltd' },
  ],
  'Banking': [
    { symbol: 'AUBANK', name: 'AU Small Finance Bank' },
    { symbol: 'ICICIBANK', name: 'Icici Bank Limited' },
    { symbol: 'SBIN', name: 'State Bank Of India' },
    { symbol: 'BANDHANBNK', name: 'Bandhan Bank Ltd' },
    { symbol: 'RBLBANK', name: 'Rbl Bank Limited' },
    { symbol: 'AXISBANK', name: 'Axis Bank Limited' },
    { symbol: 'INDUSINDBK', name: 'Indusind Bank Limited' },
    { symbol: 'INDIANB', name: 'Indian Bank' },
    { symbol: 'UNIONBANK', name: 'Union Bank Of India' },
    { symbol: 'YESBANK', name: 'Yes Bank Limited' },
    { symbol: 'FEDERALBNK', name: 'The Federal Bank  Limited' },
    { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd' },
    { symbol: 'CANBK', name: 'Canara Bank' },
    { symbol: 'BANKINDIA', name: 'Bank Of India' },
    { symbol: 'PNB', name: 'Punjab National Bank' },
    { symbol: 'BANKBARODA', name: 'Bank Of Baroda' },
    { symbol: 'HDFCBANK', name: 'Hdfc Bank Limited' },
    { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Limited' },
  ],
  'IT Services': [
    { symbol: 'HCLTECH', name: 'Hcl Technologies Limited' },
    { symbol: 'TECHM', name: 'Tech Mahindra Limited' },
    { symbol: 'INFY', name: 'Infosys Limited' },
    { symbol: 'BSOFT', name: 'Birlasoft Ltd' },
    { symbol: 'WIPRO', name: 'Wipro Limited' },
    { symbol: 'TATATECH', name: 'Tata Technologies Ltd' },
    { symbol: 'LTIM', name: 'LTI Mindtree Ltd' },
    { symbol: 'MPHASIS', name: 'Mphasis Limited' },
    { symbol: 'COFORGE', name: 'Coforge (Niit Tech)' },
    { symbol: 'KPITTECH', name: 'KPIT Technologies Ltd' },
    { symbol: 'CYIENT', name: 'Cyient Limited' },
    { symbol: 'TCS', name: 'Tata Consultancy Services Limited' },
    { symbol: 'PERSISTENT', name: 'Persistent Systems Limited' },
    { symbol: 'TATAELXSI', name: 'Tata Elxsi Limited' },
    { symbol: 'OFSS', name: 'Oracle Financial Services Software Limited' },
  ],
  'Pharmaceuticals': [
    { symbol: 'MANKIND', name: 'Mankind Pharma Ltd' },
    { symbol: 'LAURUSLABS', name: 'Laurus Labs Limited' },
    { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Limited' },
    { symbol: 'CIPLA', name: 'Cipla Limited' },
    { symbol: 'BIOCON', name: 'Biocon Limited' },
    { symbol: 'ZYDUSLIFE', name: 'Zydus Lifesciences Ltd' },
    { symbol: 'DABUR', name: 'Dabur India Limited' },
    { symbol: 'SYNGENE', name: 'Syngene International Limited' },
    { symbol: 'GLENMARK', name: 'Glenmark Pharmaceuticals Limited' },
    { symbol: 'LUPIN', name: 'Lupin Limited' },
    { symbol: 'ALKEM', name: 'Alkem Laboratories Limited' },
    { symbol: 'DRREDDY', name: 'Dr. Reddy\'s Laboratories Limited' },
    { symbol: 'GRANULES', name: 'Granules India Limited' },
    { symbol: 'PPLPHARMA', name: 'Piramal Pharma Ltd' },
    { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma Limited' },
    { symbol: 'SUNPHARMA', name: 'Sun Pharmaceuticals Industries Limited' },
    { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals Limited' },
    { symbol: 'PEL', name: 'Piramal Enterprises Limited' },
  ],
  'Automobile': [
    { symbol: 'HEROMOTOCO', name: 'Hero Motocorp Limited' },
    { symbol: 'TVSMOTOR', name: 'Tvs Motor Company Limited' },
    { symbol: 'M&M', name: 'Mahindra & Mahindra Limited' },
    { symbol: 'SONACOMS', name: 'Sona BLW Precision Forgings Ltd' },
    { symbol: 'EXIDEIND', name: 'Exide Industries Limited' },
    { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Limited' },
    { symbol: 'BALKRISIND', name: 'Balkrishna Industries Limited' },
    { symbol: 'BOSCHLTD', name: 'Bosch Limited' },
    { symbol: 'ASHOKLEY', name: 'Ashok Leyland Limited' },
    { symbol: 'UNOMINDA', name: 'Uno Minda Ltd' },
    { symbol: 'MOTHERSON', name: 'Motherson Sumi Systems Limited' },
    { symbol: 'BHARATFORG', name: 'Bharat Forge Limited' },
    { symbol: 'CUMMINSIND', name: 'Cummins India Limited' },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Limited' },
    { symbol: 'EICHERMOT', name: 'Eicher Motors Limited' },
    { symbol: 'MARUTI', name: 'Maruti Suzuki India Limited' },
    { symbol: 'TIINDIA', name: 'Tube Investments of India Ltd' },
  ],
  'Financial Services': [
    { symbol: 'ABCAPITAL', name: 'Aditya Birla Capital Ltd' },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Limited' },
    { symbol: 'IIFL', name: 'Iifl Holdings Limited' },
    { symbol: 'LICHSGFIN', name: 'Lic Housing Finance Limited' },
    { symbol: 'IRFC', name: 'Indian Railway Finance Corporation Ltd' },
    { symbol: 'CAMS', name: 'Computer Age Management Services Ltd' },
    { symbol: 'POONAWALLA', name: 'Poonawalla Fincorp Ltd' },
    { symbol: 'MFSL', name: 'Max Financial Services Limited' },
    { symbol: 'PFC', name: 'Power Finance Corporation Limited' },
    { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd' },
    { symbol: 'ICICIPRULI', name: 'Icici Prudential Life Insurance Company Limited' },
    { symbol: 'M&MFIN', name: 'Mahindra & Mahindra Financial Services Limited' },
    { symbol: 'RECLTD', name: 'Rural Electrification Corporation Limited' },
    { symbol: 'MANAPPURAM', name: 'Manappuram Finance Limited' },
    { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance Limited' },
    { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd' },
    { symbol: 'BAJFINANCE', name: 'Bajaj Finance Limited' },
    { symbol: 'PAYTM', name: 'One 97 Communications Ltd' },
    { symbol: 'LICI', name: 'Life Insurance Corporation of India' },
    { symbol: 'IREDA', name: 'Indian Renewable Energy Development Agency Ltd' },
    { symbol: 'HUDCO', name: 'Housing and Urban Development Corporation' },
    { symbol: 'PNBHOUSING', name: 'Pnb Housing Finance Limited' },
    { symbol: 'POLICYBZR', name: 'PB Fintech Ltd' },
    { symbol: 'SBICARD', name: 'SBI Cards & Payment Services Ltd' },
    { symbol: 'CHOLAFIN', name: 'Cholamandalam Investment And Finance Company Limited' },
    { symbol: 'ANGELONE', name: 'Angel One Ltd' },
    { symbol: 'HDFCAMC', name: 'HDFC Asset Management Company Ltd' },
    { symbol: 'JIOFIN', name: 'Jio Financial Services Ltd' },
    { symbol: 'SHRIRAMFIN', name: 'Shriram Finance Ltd' },
    { symbol: 'LTF', name: 'L&T Finance Ltd' },
    { symbol: 'ICICIGI', name: 'ICICI Lombard General Insurance Company Ltd' },
    { symbol: 'MCX', name: 'Multi Commodity Exchange Of India Limited' },
    { symbol: 'CDSL', name: 'Central Depository Services Ltd' },
    { symbol: 'BSE', name: 'BSE (Bombay stock exchange)' },
  ],
  'Power': [
    { symbol: 'NHPC', name: 'Nhpc Limited' },
    { symbol: 'JSWENERGY', name: 'Jsw Energy Limited' },
    { symbol: 'IEX', name: 'Indian Energy Exchange Ltd' },
    { symbol: 'SJVN', name: 'Sjvn Limited' },
    { symbol: 'NTPC', name: 'Ntpc Limited' },
    { symbol: 'TATAPOWER', name: 'Tata Power Company Limited' },
    { symbol: 'CESC', name: 'Cesc Limited' },
    { symbol: 'TORNTPOWER', name: 'Torrent Power Limited' },
    { symbol: 'ADANIENSOL', name: 'Adani Energy Solutions Ltd' },
    { symbol: 'INOXWIND', name: 'Inox Wind Limited' },
    { symbol: 'ADANIGREEN', name: 'Adani Green Energy Ltd' },
    { symbol: 'POWERGRID', name: 'Power Grid Corporation Of India Limited' },
  ],
  'Consumer Goods': [
    { symbol: 'ABFRL', name: 'Aditya Birla Fashion And Retail Limited' },
    { symbol: 'MARICO', name: 'Marico Limited' },
    { symbol: 'GODREJCP', name: 'Godrej Consumer Products Limited' },
    { symbol: 'BRITANNIA', name: 'Britannia Industries Limited' },
    { symbol: 'ITC', name: 'Itc Limited' },
    { symbol: 'NESTLEIND', name: 'Nestle India Limited' },
    { symbol: 'TITAN', name: 'Titan Company Limited' },
    { symbol: 'PATANJALI', name: 'Patanjali Foods Ltd' },
    { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Limited' },
    { symbol: 'COLPAL', name: 'Colgate Palmolive (india) Limited' },
    { symbol: 'TATACONSUM', name: 'TATA Consumer Products Ltd' },
    { symbol: 'VBL', name: 'Varun Beverages Limited' },
    { symbol: 'KALYANKJIL', name: 'Kalyan Jewellers India Ltd' },
    { symbol: 'UNITDSPR', name: 'United Spirits Ltd' },
  ],
  'Metals': [
    { symbol: 'COALINDIA', name: 'Coal India Limited' },
    { symbol: 'HINDCOPPER', name: 'Hindustan Copper Limited' },
    { symbol: 'VEDL', name: 'Vedanta Limited' },
    { symbol: 'APLAPOLLO', name: 'Apl Apollo Tubes Limited' },
    { symbol: 'SAIL', name: 'Steel Authority Of India Limited' },
    { symbol: 'JSWSTEEL', name: 'Jsw Steel Limited' },
    { symbol: 'TATASTEEL', name: 'Tata Steel Limited' },
    { symbol: 'JSL', name: 'Jindal Stainless Limited' },
    { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Limited' },
    { symbol: 'HINDALCO', name: 'Hindalco Industries Limited' },
    { symbol: 'HINDZINC', name: 'Hindustan Zinc Limited' },
    { symbol: 'NATIONALUM', name: 'National Aluminium Company Limited' },
  ],
  'Infrastructure': [
    { symbol: 'RVNL', name: 'Rail Vikas Nigam Ltd' },
    { symbol: 'GMRAIRPORT', name: 'GMR Airports Ltd' },
    { symbol: 'NBCC', name: 'Nbcc (india) Limited' },
    { symbol: 'LT', name: 'Larsen & Toubro Limited' },
    { symbol: 'NCC', name: 'Ncc Limited' },
    { symbol: 'IRB', name: 'Irb Infrastructure Developers Limited' },
    { symbol: 'TITAGARH', name: 'Titagarh Rail Systems Ltd' },
    { symbol: 'ADANIPORTS', name: 'Adani Ports And Special Economic Zone Limited' },
  ],
  'Real Estate': [
    { symbol: 'PHOENIXLTD', name: 'The Phoenix Mills Limited' },
    { symbol: 'DLF', name: 'Dlf Limited' },
    { symbol: 'LODHA', name: 'Macrotech Developers Ltd' },
    { symbol: 'PRESTIGE', name: 'Prestige Estates Projects Limited' },
    { symbol: 'GODREJPROP', name: 'Godrej Properties Limited' },
    { symbol: 'OBEROIRLTY', name: 'Oberoi Realty Limited' },
  ],
  'Telecommunications': [
    { symbol: 'HFCL', name: 'Himachal Futuristic Communications Limited' },
    { symbol: 'IDEA', name: 'Idea Cellular Limited' },
    { symbol: 'INDUSTOWER', name: 'Indus Towers Ltd (Bharti Infratel)' },
    { symbol: 'BHARTIARTL', name: 'Bharti Airtel Limited' },
    { symbol: 'TATACOMM', name: 'Tata Communications Limited' },
  ],
  'Cement': [
    { symbol: 'SHREECEM', name: 'Shree Cements Limited' },
    { symbol: 'ULTRACEMCO', name: 'Ultratech Cement Limited' },
    { symbol: 'AMBUJACEM', name: 'Ambuja Cements Limited' },
    { symbol: 'GRASIM', name: 'Grasim Industries Limited' },
    { symbol: 'ACC', name: 'Acc Limited' },
    { symbol: 'DALBHARAT', name: 'Dalmia Bharat Limited' },
  ],
  'Chemicals': [
    { symbol: 'AARTIIND', name: 'Aarti Industries Limited' },
    { symbol: 'ETERNAL', name: 'Eternal Ltd' },
    { symbol: 'TATACHEM', name: 'Tata Chemicals Limited' },
    { symbol: 'PIDILITIND', name: 'Pidilite Industries Limited' },
    { symbol: 'UPL', name: 'Upl Limited' },
    { symbol: 'SOLARINDS', name: 'Solar Industries India Limited' },
    { symbol: 'SRF', name: 'Srf Limited' },
    { symbol: 'SUPREMEIND', name: 'Supreme Industries Limited' },
    { symbol: 'ASIANPAINT', name: 'Asian Paints Limited' },
    { symbol: 'PIIND', name: 'Pi Industries Limited' },
  ],
  'Healthcare': [
    { symbol: 'MAXHEALTH', name: 'Max Healthcare Institute Ltd' },
    { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Limited' },
    { symbol: 'FORTIS', name: 'Fortis Healthcare Limited' },
  ],
  'Consumer Services': [
    { symbol: 'IRCTC', name: 'Indian Railway Catering & Tourism Corporation Ltd' },
    { symbol: 'DMART', name: 'Avenue Supermarts' },
    { symbol: 'INDHOTEL', name: 'The Indian Hotels Company Limited' },
    { symbol: 'TRENT', name: 'Trent Limited' },
    { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures Ltd' },
    { symbol: 'JUBLFOOD', name: 'Jubilant Foodworks Limited' },
    { symbol: 'NAUKRI', name: 'Info Edge (india) Limited' },
  ],
  'Electrical Equipment': [
    { symbol: 'POLYCAB', name: 'Polycab India Ltd' },
    { symbol: 'KEI', name: 'Kei Industries Limited' },
    { symbol: 'HAVELLS', name: 'Havells India Limited' },
    { symbol: 'CROMPTON', name: 'Crompton Greaves Consumer Electricals Limited' },
    { symbol: 'CGPOWER', name: 'CG Power and Industrial Solutions Ltd' },
    { symbol: 'BHEL', name: 'Bharat Heavy Electricals Limited' },
  ],
  'Mining': [
    { symbol: 'NMDC', name: 'Nmdc Limited' },
  ],
  'Textiles': [
    { symbol: 'PAGEIND', name: 'Page Industries Limited' },
  ],
  'Consumer Durables': [
    { symbol: 'BLUESTARCO', name: 'Blue Star Limited' },
    { symbol: 'VOLTAS', name: 'Voltas Limited' },
  ],
  'Transportation': [
    { symbol: 'INDIGO', name: 'Interglobe Aviation Limited' },
  ],
  'Fertilizers': [
    { symbol: 'CHAMBLFERT', name: 'Chambal Fertilizers & Chemicals Limited' },
  ],
  'Logistics': [
    { symbol: 'CONCOR', name: 'Container Corporation Of India Limited' },
    { symbol: 'DELHIVERY', name: 'Delhivery Ltd' },
  ],
  'Building Materials': [
    { symbol: 'ASTRAL', name: 'Astral Poly Technik Limited' },
  ],
  'Electronics': [
    { symbol: 'KAYNES', name: 'Kaynes Technology India Ltd' },
    { symbol: 'DIXON', name: 'Dixon Technologies' },
  ],
  'Aerospace & Defense': [
    { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd' },
    { symbol: 'BEL', name: 'Bharat Electronics Limited' },
    { symbol: 'BDL', name: 'Bharat Dynamics Ltd' },
    { symbol: 'MAZDOCK', name: 'Mazagon Dock Shipbuilders Ltd' },
  ],
  'Industrial Manufacturing': [
    { symbol: 'SIEMENS', name: 'Siemens Limited' },
    { symbol: 'ABB', name: 'Abb India Limited' },
  ],
  'Conglomerates': [
    { symbol: 'ADANIENT', name: 'Adani Enterprises Limited' },
  ],
  'Index': [
    { symbol: 'NIFTY', name: 'NIFTY' },
    { symbol: 'BANKNIFTY', name: 'BANKNIFTY' },
    { symbol: 'CNXMIDCAP', name: 'CNXMIDCAP' },
  ],
};

// Flatten all Indian stocks for easy access
const allIndianStocks = Object.entries(indianStocksBySector).flatMap(([sector, stocks]) =>
  stocks.map(stock => ({ ...stock, sector }))
);

export function AssetManager() {
  const { assets, addAsset, updateAsset, deleteAsset } = useTradingData();
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isAddingIndianStocks, setIsAddingIndianStocks] = useState(false);
  const [showIndianStocks, setShowIndianStocks] = useState(false);
  
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

  const addIndianStock = (stock: typeof allIndianStocks[0]) => {
    const assetData = {
      symbol: stock.symbol,
      name: stock.name,
      category: 'stocks' as Asset['category'],
      exchange: 'NSE',
      sector: stock.sector,
      isActive: false,
    };
    addAsset(assetData);
  };

  const addAllIndianStocks = async () => {
    setIsAddingIndianStocks(true);
    
    try {
      // Check which stocks are already added
      const existingSymbols = new Set(assets.map(asset => asset.symbol.toUpperCase()));
      const stocksToAdd = allIndianStocks.filter(stock => !existingSymbols.has(stock.symbol.toUpperCase()));
      
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
    const matchesSector = selectedSector === 'all' || asset.sector === selectedSector;
    const matchesFavorites = !showFavorites || asset.isActive;
    
    return matchesSearch && matchesCategory && matchesSector && matchesFavorites;
  });

  const getCategoryInfo = (category: string) => {
    return assetCategories.find(cat => cat.value === category) || assetCategories[0];
  };

  // Get unique sectors from assets
  const availableSectors = [...new Set(assets.map(asset => asset.sector).filter(Boolean))].sort();

  // Filter Indian stocks based on search and sector
  const filteredIndianStocks = allIndianStocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const indianStockSectors = Object.keys(indianStocksBySector).sort();

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
            onClick={() => setShowIndianStocks(!showIndianStocks)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
          >
            <Flag className="h-4 w-4 mr-2" />
            {showIndianStocks ? 'Hide' : 'Show'} Indian Stocks
          </button>
          <button
            onClick={addAllIndianStocks}
            disabled={isAddingIndianStocks}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isAddingIndianStocks ? 'Adding...' : 'Add All Indian Stocks'}
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

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Sectors</option>
              {(showIndianStocks ? indianStockSectors : availableSectors).map(sector => (
                <option key={sector} value={sector}>{sector}</option>
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

      {/* Indian Stocks Browser */}
      {showIndianStocks && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
            <div className="flex items-center">
              <div className="p-2 bg-orange-500 rounded-lg mr-3">
                <Flag className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Indian Stock Market</h3>
                <p className="text-sm text-gray-600">Browse and add Indian stocks by sector</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="mb-4 text-sm text-gray-600">
              Total Indian Stocks: <span className="font-semibold text-orange-600">{allIndianStocks.length}</span> | 
              Sectors: <span className="font-semibold text-orange-600">{indianStockSectors.length}</span> | 
              Showing: <span className="font-semibold text-blue-600">{filteredIndianStocks.length}</span>
            </div>
            
            {selectedSector === 'all' ? (
              // Show by sectors
              <div className="space-y-6">
                {indianStockSectors.map(sector => {
                  const sectorStocks = indianStocksBySector[sector].filter(stock => 
                    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                  
                  if (sectorStocks.length === 0) return null;
                  
                  return (
                    <div key={sector} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Building2 className="h-5 w-5 mr-2 text-orange-500" />
                          {sector}
                        </h4>
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full">
                          {sectorStocks.length} stocks
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {sectorStocks.map(stock => {
                          const isAdded = assets.some(asset => asset.symbol === stock.symbol);
                          return (
                            <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center">
                                <div className="p-2 bg-orange-100 rounded-lg mr-3">
                                  <MapPin className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium text-gray-900">{stock.symbol}</h5>
                                  <p className="text-xs text-gray-500 truncate max-w-32">{stock.name}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => addIndianStock(stock)}
                                disabled={isAdded}
                                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                                  isAdded
                                    ? 'text-green-700 bg-green-100 cursor-not-allowed'
                                    : 'text-orange-700 bg-orange-100 hover:bg-orange-200'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <span className="mr-1">✓</span>
                                    Added
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Show filtered stocks in selected sector
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredIndianStocks.map(stock => {
                  const isAdded = assets.some(asset => asset.symbol === stock.symbol);
                  return (
                    <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-lg mr-3">
                          <MapPin className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-900">{stock.symbol}</h5>
                          <p className="text-xs text-gray-500 truncate max-w-40">{stock.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addIndianStock(stock)}
                        disabled={isAdded}
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                          isAdded
                            ? 'text-green-700 bg-green-100 cursor-not-allowed'
                            : 'text-orange-700 bg-orange-100 hover:bg-orange-200'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <span className="mr-1">✓</span>
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

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
      {!showIndianStocks && (
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
      )}

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
                  : 'Get started by adding your first trading asset or browse Indian stocks'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.map((asset) => {
                const categoryInfo = getCategoryInfo(asset.category);
                const CategoryIcon = categoryInfo.icon;
                const isIndianStock = asset.exchange === 'NSE';
                
                return (
                  <div key={asset.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-md ${categoryInfo.color} mr-3 relative`}>
                          <CategoryIcon className="h-4 w-4 text-white" />
                          {isIndianStock && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full flex items-center justify-center">
                              <Flag className="h-2 w-2 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 flex items-center">
                            {asset.symbol}
                            {isIndianStock && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                <Flag className="h-2.5 w-2.5 mr-1" />
                                NSE
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-gray-500">{asset.name}</p>
                          {asset.exchange && !isIndianStock && (
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