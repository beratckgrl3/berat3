import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Atom, Search, Filter, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Element {
  number: number;
  symbol: string;
  name: string;
  nameTurkish: string;
  atomic_mass: number;
  category: string;
  period: number;
  group: number;
  phase: string;
  electron_configuration: string;
  density?: number;
  melting_point?: number;
  boiling_point?: number;
  discovered_by?: string;
  discovery_year?: number;
  description: string;
}

const periodicElements: Element[] = [
  // 1. Period
  { number: 1, symbol: "H", name: "Hydrogen", nameTurkish: "Hidrojen", atomic_mass: 1.008, category: "nonmetal", period: 1, group: 1, phase: "gas", electron_configuration: "1s¹", density: 0.09, melting_point: -259, boiling_point: -253, discovered_by: "Henry Cavendish", discovery_year: 1766, description: "En hafif element. Evrenin %75'ini oluşturur." },
  { number: 2, symbol: "He", name: "Helium", nameTurkish: "Helyum", atomic_mass: 4.003, category: "noble-gas", period: 1, group: 18, phase: "gas", electron_configuration: "1s²", density: 0.18, melting_point: -272, boiling_point: -269, discovered_by: "Pierre Janssen", discovery_year: 1868, description: "Soy gaz. Balonlarda ve soğutma sistemlerinde kullanılır." },
  
  // 2. Period
  { number: 3, symbol: "Li", name: "Lithium", nameTurkish: "Lityum", atomic_mass: 6.941, category: "alkali-metal", period: 2, group: 1, phase: "solid", electron_configuration: "[He] 2s¹", density: 0.53, melting_point: 181, boiling_point: 1342, discovered_by: "Johan August Arfwedson", discovery_year: 1817, description: "En hafif metal. Pil teknolojisinde kritik öneme sahip." },
  { number: 4, symbol: "Be", name: "Beryllium", nameTurkish: "Berilyum", atomic_mass: 9.012, category: "alkaline-earth-metal", period: 2, group: 2, phase: "solid", electron_configuration: "[He] 2s²", density: 1.85, melting_point: 1287, boiling_point: 2469, discovered_by: "Louis Nicolas Vauquelin", discovery_year: 1798, description: "Hafif ve güçlü metal. Havacılık endüstrisinde kullanılır." },
  { number: 5, symbol: "B", name: "Boron", nameTurkish: "Bor", atomic_mass: 10.811, category: "metalloid", period: 2, group: 13, phase: "solid", electron_configuration: "[He] 2s² 2p¹", density: 2.34, melting_point: 2077, boiling_point: 4000, discovered_by: "Joseph Louis Gay-Lussac", discovery_year: 1808, description: "Yarı iletken özellikli. Cam ve seramik endüstrisinde kullanılır." },
  { number: 6, symbol: "C", name: "Carbon", nameTurkish: "Karbon", atomic_mass: 12.011, category: "nonmetal", period: 2, group: 14, phase: "solid", electron_configuration: "[He] 2s² 2p²", density: 2.27, melting_point: 3550, boiling_point: 4827, discovered_by: "Antik çağ", discovery_year: -3750, description: "Yaşamın temel elementi. Elmas ve grafit formlarında bulunur." },
  { number: 7, symbol: "N", name: "Nitrogen", nameTurkish: "Azot", atomic_mass: 14.007, category: "nonmetal", period: 2, group: 15, phase: "gas", electron_configuration: "[He] 2s² 2p³", density: 1.25, melting_point: -210, boiling_point: -196, discovered_by: "Daniel Rutherford", discovery_year: 1772, description: "Atmosferin %78'ini oluşturur. Protein sentezi için gerekli." },
  { number: 8, symbol: "O", name: "Oxygen", nameTurkish: "Oksijen", atomic_mass: 15.999, category: "nonmetal", period: 2, group: 16, phase: "gas", electron_configuration: "[He] 2s² 2p⁴", density: 1.43, melting_point: -218, boiling_point: -183, discovered_by: "Carl Wilhelm Scheele", discovery_year: 1774, description: "Yaşam için gerekli. Atmosferin %21'ini oluşturur." },
  { number: 9, symbol: "F", name: "Fluorine", nameTurkish: "Flor", atomic_mass: 18.998, category: "halogen", period: 2, group: 17, phase: "gas", electron_configuration: "[He] 2s² 2p⁵", density: 1.70, melting_point: -220, boiling_point: -188, discovered_by: "André-Marie Ampère", discovery_year: 1886, description: "En reaktif element. Diş macunu ve teflon üretiminde kullanılır." },
  { number: 10, symbol: "Ne", name: "Neon", nameTurkish: "Neon", atomic_mass: 20.180, category: "noble-gas", period: 2, group: 18, phase: "gas", electron_configuration: "[He] 2s² 2p⁶", density: 0.90, melting_point: -249, boiling_point: -246, discovered_by: "William Ramsay", discovery_year: 1898, description: "Soy gaz. Renkli ışık reklamlarında kullanılır." },
  
  // 3. Period
  { number: 11, symbol: "Na", name: "Sodium", nameTurkish: "Sodyum", atomic_mass: 22.990, category: "alkali-metal", period: 3, group: 1, phase: "solid", electron_configuration: "[Ne] 3s¹", density: 0.97, melting_point: 98, boiling_point: 883, discovered_by: "Humphry Davy", discovery_year: 1807, description: "Yaygın alkali metal. Sofra tuzu (NaCl) bileşenlerinden biri." },
  { number: 12, symbol: "Mg", name: "Magnesium", nameTurkish: "Magnezyum", atomic_mass: 24.305, category: "alkaline-earth-metal", period: 3, group: 2, phase: "solid", electron_configuration: "[Ne] 3s²", density: 1.74, melting_point: 650, boiling_point: 1090, discovered_by: "Joseph Black", discovery_year: 1755, description: "Hafif metal. Otomobil endüstrisi ve klorofil molekülünde bulunur." },
  { number: 13, symbol: "Al", name: "Aluminum", nameTurkish: "Alüminyum", atomic_mass: 26.982, category: "post-transition-metal", period: 3, group: 13, phase: "solid", electron_configuration: "[Ne] 3s² 3p¹", density: 2.70, melting_point: 660, boiling_point: 2519, discovered_by: "Hans Christian Ørsted", discovery_year: 1825, description: "Hafif ve korozyona dayanıklı. Ambalaj ve uçak endüstrisinde yaygın." },
  { number: 14, symbol: "Si", name: "Silicon", nameTurkish: "Silisyum", atomic_mass: 28.086, category: "metalloid", period: 3, group: 14, phase: "solid", electron_configuration: "[Ne] 3s² 3p²", density: 2.33, melting_point: 1414, boiling_point: 3265, discovered_by: "Jöns Jacob Berzelius", discovery_year: 1824, description: "Yarı iletken teknolojinin temeli. Bilgisayar çiplerinde kullanılır." },
  { number: 15, symbol: "P", name: "Phosphorus", nameTurkish: "Fosfor", atomic_mass: 30.974, category: "nonmetal", period: 3, group: 15, phase: "solid", electron_configuration: "[Ne] 3s² 3p³", density: 1.82, melting_point: 44, boiling_point: 281, discovered_by: "Hennig Brand", discovery_year: 1669, description: "DNA ve kemik yapısında bulunur. Gübre ve kibrit üretiminde kullanılır." },
  { number: 16, symbol: "S", name: "Sulfur", nameTurkish: "Kükürt", atomic_mass: 32.065, category: "nonmetal", period: 3, group: 16, phase: "solid", electron_configuration: "[Ne] 3s² 3p⁴", density: 2.07, melting_point: 115, boiling_point: 445, discovered_by: "Antik çağ", discovery_year: -2000, description: "Protein yapısında bulunan element. Asit ve gübre üretiminde kullanılır." },
  { number: 17, symbol: "Cl", name: "Chlorine", nameTurkish: "Klor", atomic_mass: 35.453, category: "halogen", period: 3, group: 17, phase: "gas", electron_configuration: "[Ne] 3s² 3p⁵", density: 3.21, melting_point: -102, boiling_point: -34, discovered_by: "Carl Wilhelm Scheele", discovery_year: 1774, description: "Dezenfektan olarak kullanılır. Sofra tuzu bileşenlerinden biri." },
  { number: 18, symbol: "Ar", name: "Argon", nameTurkish: "Argon", atomic_mass: 39.948, category: "noble-gas", period: 3, group: 18, phase: "gas", electron_configuration: "[Ne] 3s² 3p⁶", density: 1.78, melting_point: -189, boiling_point: -186, discovered_by: "Lord Rayleigh", discovery_year: 1894, description: "Soy gaz. Koruyucu atmosfer olarak kaynak işlemlerinde kullanılır." },
];

const categoryColors = {
  "alkali-metal": "bg-red-100 dark:bg-red-900 border-red-300 text-red-800 dark:text-red-100",
  "alkaline-earth-metal": "bg-orange-100 dark:bg-orange-900 border-orange-300 text-orange-800 dark:text-orange-100",
  "transition-metal": "bg-yellow-100 dark:bg-yellow-900 border-yellow-300 text-yellow-800 dark:text-yellow-100",
  "post-transition-metal": "bg-green-100 dark:bg-green-900 border-green-300 text-green-800 dark:text-green-100",
  "metalloid": "bg-blue-100 dark:bg-blue-900 border-blue-300 text-blue-800 dark:text-blue-100",
  "nonmetal": "bg-purple-100 dark:bg-purple-900 border-purple-300 text-purple-800 dark:text-purple-100",
  "halogen": "bg-pink-100 dark:bg-pink-900 border-pink-300 text-pink-800 dark:text-pink-100",
  "noble-gas": "bg-gray-100 dark:bg-gray-800 border-gray-300 text-gray-800 dark:text-gray-100"
};

const categoryNamesTurkish = {
  "alkali-metal": "Alkali Metal",
  "alkaline-earth-metal": "Toprak Alkali Metal",
  "transition-metal": "Geçiş Metali",
  "post-transition-metal": "Geçiş Sonrası Metal",
  "metalloid": "Yarı Metal",
  "nonmetal": "Ametal",
  "halogen": "Halojen",
  "noble-gas": "Soy Gaz"
};

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [filteredElements, setFilteredElements] = useState(periodicElements);

  useEffect(() => {
    let filtered = periodicElements;
    
    if (searchTerm) {
      filtered = filtered.filter(element => 
        element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.nameTurkish.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.number.toString().includes(searchTerm)
      );
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter(element => element.category === categoryFilter);
    }
    
    setFilteredElements(filtered);
  }, [searchTerm, categoryFilter]);

  const getElementPosition = (element: Element) => {
    // Modern periyodik tabloda özel konumlandırma
    const row = element.period;
    let col = element.group;
    
    // Periyot 1 için özel düzenleme
    if (element.period === 1) {
      if (element.number === 1) col = 1; // Hidrojen
      if (element.number === 2) col = 18; // Helyum
    }
    
    return { row, col };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Atom className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Periyodik Cetvel
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kimyasal elementlerin modern periyodik sistemi. Her elementin detaylı bilgilerine ulaşabilirsiniz.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Element ara... (isim, sembol, numara)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-element"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-64 pl-10" data-testid="select-category-filter">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {Object.entries(categoryNamesTurkish).map(([key, name]) => (
                    <SelectItem key={key} value={key}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(categoryNamesTurkish).map(([key, name]) => (
              <Badge key={key} variant="outline" className={categoryColors[key as keyof typeof categoryColors]}>
                {name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Periodic Table Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-18 gap-1 p-4 bg-card rounded-2xl border shadow-lg max-w-full overflow-x-auto">
            {Array.from({ length: 7 }, (_, periodIndex) => {
              const period = periodIndex + 1;
              const elementsInPeriod = filteredElements.filter(el => el.period === period);
              
              return Array.from({ length: 18 }, (_, groupIndex) => {
                const group = groupIndex + 1;
                const element = elementsInPeriod.find(el => {
                  const pos = getElementPosition(el);
                  return pos.col === group;
                });
                
                if (!element) {
                  return (
                    <div
                      key={`${period}-${group}`}
                      className="aspect-square min-w-0"
                    />
                  );
                }
                
                return (
                  <div
                    key={element.number}
                    onClick={() => setSelectedElement(element)}
                    className={`
                      aspect-square min-w-0 p-1 rounded-lg border-2 cursor-pointer
                      transition-all duration-200 hover:scale-105 hover:shadow-lg
                      flex flex-col items-center justify-center text-center
                      ${categoryColors[element.category as keyof typeof categoryColors]}
                    `}
                    data-testid={`element-${element.symbol}`}
                  >
                    <div className="text-xs font-medium leading-none mb-1">
                      {element.number}
                    </div>
                    <div className="text-lg font-bold leading-none mb-1">
                      {element.symbol}
                    </div>
                    <div className="text-xs leading-none truncate w-full">
                      {element.nameTurkish}
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>

        {/* Search Results for Filtered View */}
        {(searchTerm || categoryFilter !== "all") && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Arama Sonuçları ({filteredElements.length} element)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {filteredElements.map(element => (
                <div
                  key={element.number}
                  onClick={() => setSelectedElement(element)}
                  className={`
                    aspect-square p-3 rounded-xl border-2 cursor-pointer
                    transition-all duration-200 hover:scale-105 hover:shadow-lg
                    flex flex-col items-center justify-center text-center
                    ${categoryColors[element.category as keyof typeof categoryColors]}
                  `}
                  data-testid={`search-result-${element.symbol}`}
                >
                  <div className="text-sm font-medium mb-1">{element.number}</div>
                  <div className="text-xl font-bold mb-1">{element.symbol}</div>
                  <div className="text-xs truncate w-full">{element.nameTurkish}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Element Detail Modal */}
        <Dialog open={!!selectedElement} onOpenChange={() => setSelectedElement(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className={`
                  w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center
                  ${selectedElement ? categoryColors[selectedElement.category as keyof typeof categoryColors] : ''}
                `}>
                  <div className="text-sm font-medium">{selectedElement?.number}</div>
                  <div className="text-lg font-bold">{selectedElement?.symbol}</div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedElement?.nameTurkish}</h3>
                  <p className="text-lg text-muted-foreground">{selectedElement?.name}</p>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                {selectedElement && (
                  <>
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Temel Bilgiler</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Atom Numarası:</span>
                            <span className="font-medium">{selectedElement.number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Atom Kütlesi:</span>
                            <span className="font-medium">{selectedElement.atomic_mass}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Periyot:</span>
                            <span className="font-medium">{selectedElement.period}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Grup:</span>
                            <span className="font-medium">{selectedElement.group}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Fiziksel Özellikler</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Hal:</span>
                            <span className="font-medium capitalize">
                              {selectedElement.phase === 'solid' ? 'Katı' : 
                               selectedElement.phase === 'liquid' ? 'Sıvı' : 'Gaz'}
                            </span>
                          </div>
                          {selectedElement.density && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Yoğunluk:</span>
                              <span className="font-medium">{selectedElement.density} g/cm³</span>
                            </div>
                          )}
                          {selectedElement.melting_point && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Erime Noktası:</span>
                              <span className="font-medium">{selectedElement.melting_point}°C</span>
                            </div>
                          )}
                          {selectedElement.boiling_point && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Kaynama Noktası:</span>
                              <span className="font-medium">{selectedElement.boiling_point}°C</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Electron Configuration */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Elektron Dizilimi</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <code className="text-lg font-mono bg-muted px-3 py-2 rounded">
                          {selectedElement.electron_configuration}
                        </code>
                      </CardContent>
                    </Card>

                    {/* Category */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Kategori</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge className={categoryColors[selectedElement.category as keyof typeof categoryColors]}>
                          {categoryNamesTurkish[selectedElement.category as keyof typeof categoryNamesTurkish]}
                        </Badge>
                      </CardContent>
                    </Card>

                    {/* Discovery */}
                    {selectedElement.discovered_by && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Keşif</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Keşfeden:</span>
                            <span className="font-medium">{selectedElement.discovered_by}</span>
                          </div>
                          {selectedElement.discovery_year && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Keşif Yılı:</span>
                              <span className="font-medium">
                                {selectedElement.discovery_year > 0 ? selectedElement.discovery_year : `MÖ ${Math.abs(selectedElement.discovery_year)}`}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Description */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Açıklama
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedElement.description}
                        </p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}