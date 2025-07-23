'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Plus, X, Save } from 'lucide-react'
import Link from 'next/link'

export default function CreatePackage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    duration: '',
    region: '',
    regionKo: '',
    description: '',
    image: '',
    images: [''], // ?щ윭 ?대?吏瑜??꾪븳 諛곗뿴
    highlights: [''],
    departure: '',
    type: '',
    min_people: 1,
    max_people: 10,
    itinerary: [{
      day: 1,
      title: '',
      description: '',
      accommodation: '',
      meals: { breakfast: false, lunch: false, dinner: false }
    }],
    included: [''],
    excluded: [''],
    notes: [''],
    is_featured: false,
    start_date: '',
    end_date: '',
    location: '',
    category: ''
  })
  
  // ?レ옄瑜?泥??⑥쐞 肄ㅻ쭏 ?뺤떇?쇰줈 蹂?섑븯???⑥닔
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR')
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (name === 'price') {
      // 肄ㅻ쭏 ?쒓굅 ???レ옄留?異붿텧
      const numericValue = value.replace(/[^\d]/g, '')
      setFormData({ ...formData, [name]: parseInt(numericValue) || 0 })
    } else if (name === 'min_people' || name === 'max_people') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 })
    } else if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
    } else if (name === 'category') {
      // 移댄뀒怨좊━ 蹂寃???type怨?region ?먮룞 ?ㅼ젙
      let newType = '';
      let newRegion = '';
      let newRegionKo = '';
      
      if (value === 'overseas-europe') {
        newType = 'overseas';
        newRegion = 'europe';
        newRegionKo = '?좊읇';
      } else if (value === 'overseas-japan') {
        newType = 'overseas';
        newRegion = 'japan';
        newRegionKo = '?쇰낯';
      } else if (value === 'overseas-southeast-asia') {
        newType = 'overseas';
        newRegion = 'southeast-asia';
        newRegionKo = '?숇궓??;
      } else if (value === 'overseas-americas') {
        newType = 'overseas';
        newRegion = 'americas';
        newRegionKo = '誘몄＜/罹먮굹???섏???;
      } else if (value === 'overseas-china-hongkong') {
        newType = 'overseas';
        newRegion = 'china-hongkong';
        newRegionKo = '?留??띿쉘/留덉뭅??;
      } else if (value === 'overseas-guam-saipan') {
        newType = 'overseas';
        newRegion = 'guam-saipan';
        newRegionKo = '愿??ъ씠??;
      } else if (value === 'domestic-hotel') {
        newType = 'domestic';
        newRegion = 'hotel';
        newRegionKo = '?명뀛';
      } else if (value === 'domestic-resort') {
        newType = 'domestic';
        newRegion = 'resort';
        newRegionKo = '由ъ“??;
      } else if (value === 'domestic-pool-villa') {
        newType = 'domestic';
        newRegion = 'pool-villa';
        newRegionKo = '?鍮뚮씪';
      } else if (value === 'hotel-europe') {
        newType = 'hotel';
        newRegion = 'europe';
        newRegionKo = '?좊읇';
      } else if (value === 'hotel-japan') {
        newType = 'hotel';
        newRegion = 'japan';
        newRegionKo = '?쇰낯';
      } else if (value === 'hotel-southeast-asia') {
        newType = 'hotel';
        newRegion = 'southeast-asia';
        newRegionKo = '?숇궓??;
      } else if (value === 'hotel-americas') {
        newType = 'hotel';
        newRegion = 'americas';
        newRegionKo = '誘몄＜/罹먮굹???섏???;
      } else if (value === 'hotel-china-hongkong') {
        newType = 'hotel';
        newRegion = 'china-hongkong';
        newRegionKo = '?留??띿쉘/留덉뭅??;
      } else if (value === 'hotel-guam-saipan') {
        newType = 'hotel';
        newRegion = 'guam-saipan';
        newRegionKo = '愿??ъ씠??;
      } else if (value === 'luxury-europe') {
        newType = 'luxury';
        newRegion = 'europe';
        newRegionKo = '?좊읇';
      } else if (value === 'luxury-japan') {
        newType = 'luxury';
        newRegion = 'japan';
        newRegionKo = '?쇰낯';
      } else if (value === 'luxury-southeast-asia') {
        newType = 'luxury';
        newRegion = 'southeast-asia';
        newRegionKo = '?숇궓??;
      } else if (value === 'luxury-cruise') {
        newType = 'luxury';
        newRegion = 'cruise';
        newRegionKo = '?щ（利?;
      } else if (value === 'luxury-special-theme') {
        newType = 'luxury';
        newRegion = 'special-theme';
        newRegionKo = '?댁깋?뚮쭏';
      }
      
      setFormData({ 
        ...formData, 
        [name]: value,
        type: newType,
        region: newRegion,
        regionKo: newRegionKo
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }
  
  const handleArrayChange = (index: number, value: string, field: 'highlights' | 'included' | 'excluded' | 'notes' | 'images') => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }
  
  const addArrayItem = (field: 'highlights' | 'included' | 'excluded' | 'notes' | 'images') => {
    if (field === 'images' && formData.images.length >= 10) {
      alert('?대?吏??理쒕? 10媛쒓퉴吏留?異붽??????덉뒿?덈떎.');
      return;
    }
    const newArray = [...formData[field], '']
    setFormData({ ...formData, [field]: newArray })
  }
  
  const removeArrayItem = (index: number, field: 'highlights' | 'included' | 'excluded' | 'notes' | 'images') => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: newArray })
  }
  
  const handleItineraryChange = (index: number, field: string, value: any) => {
    const newItinerary = [...formData.itinerary]
    
    if (field === 'breakfast' || field === 'lunch' || field === 'dinner') {
      newItinerary[index].meals = {
        ...newItinerary[index].meals,
        [field]: value
      }
    } else {
      // @ts-ignore
      newItinerary[index][field] = value
    }
    
    setFormData({ ...formData, itinerary: newItinerary })
  }
  
  const addItineraryDay = () => {
    const lastDay = formData.itinerary[formData.itinerary.length - 1].day
    const newDay = {
      day: lastDay + 1,
      title: '',
      description: '',
      accommodation: '',
      meals: { breakfast: false, lunch: false, dinner: false }
    }
    
    setFormData({ ...formData, itinerary: [...formData.itinerary, newDay] })
  }
  
  const removeItineraryDay = (index: number) => {
    const newItinerary = formData.itinerary
      .filter((_, i) => i !== index)
      .map((day, i) => ({ ...day, day: i + 1 }))
      
    setFormData({ ...formData, itinerary: newItinerary })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // ?꾩닔 ?꾨뱶 寃利?
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error('?꾩닔 ?꾨뱶瑜?紐⑤몢 ?낅젰?댁＜?몄슂. (?대쫫, 媛寃? 移댄뀒怨좊━)')
      }
      
      // 諛곗뿴 ?꾨뱶?먯꽌 鍮???ぉ ?꾪꽣留?
      const highlights = formData.highlights.filter(item => item.trim() !== '')
      const included = formData.included.filter(item => item.trim() !== '')
      const excluded = formData.excluded.filter(item => item.trim() !== '')
      const notes = formData.notes.filter(item => item.trim() !== '')
      const images = formData.images.filter(item => item.trim() !== '')
      
      // ?ы뻾 ?쇱젙 寃利?
      const itinerary = formData.itinerary.map(day => ({
        ...day,
        title: day.title.trim() || `Day ${day.day}`,
        description: day.description.trim()
      }))
      
      // 怨좎쑀 ID ?앹꽦
      const packageId = `pkg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // ?곗씠?곕쿋?댁뒪 ?쎌엯 以鍮?
      const supabase = createClient()
      
      // ?⑦궎吏 ?앹꽦
      const { error } = await supabase
        .from('packages')
        .insert({
          // id ?꾨뱶???곗씠?곕쿋?댁뒪?먯꽌 ?먮룞?쇰줈 ?앹꽦?섎룄濡??쒖쇅
          name: formData.name, // ?꾨뱶紐낆쓣 name?쇰줈 ?섏젙
          price: formData.price || 0, // String ???蹂???쒓굅
          region: formData.region,
          region_ko: formData.regionKo || '',
          type: formData.type, // type ?꾨뱶瑜??щ컮瑜닿쾶 ???(overseas, hotel, domestic, luxury)
          description: formData.description || '',
          image: images.length > 0 ? images[0] : '', // 泥?踰덉㎏ ?대?吏瑜?硫붿씤 ?대?吏濡??ъ슜
          images: images.length > 0 ? images : [''], // ?대?吏 諛곗뿴 ???
          is_featured: formData.is_featured,
          duration: formData.duration || '',
          departure: formData.departure || '',
          highlights: highlights.length ? highlights : [''],
          itinerary: itinerary || [{day: 1, title: '', description: '', accommodation: '', meals: {breakfast: false, lunch: false, dinner: false}}],
          included: included.length ? included : [''],
          excluded: excluded.length ? excluded : [''],
          notes: notes.length ? notes : [''],
          min_people: formData.min_people || 1,
          max_people: formData.max_people || 10,
          location: formData.location || ''
        })
      
      if (error) throw error
      
      // ?깃났 ??紐⑸줉 ?섏씠吏濡??대룞
      router.push('/admin/packages')
      router.refresh()
      
    } catch (error: any) {
      console.error('?⑦궎吏 ?앹꽦 ?ㅽ뙣:', error)
      setError(error.message || '?⑦궎吏 ?앹꽦 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎')
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <div className="pb-12">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/admin/packages" className="mr-4 text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">???⑦궎吏 異붽?</h1>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 湲곕낯 ?뺣낫 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">湲곕낯 ?뺣낫</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ?⑦궎吏紐?<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                移댄뀒怨좊━ <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">移댄뀒怨좊━ ?좏깮</option>
                <optgroup label="?댁쇅?ы뻾">
                  <option value="overseas-europe">?좊읇</option>
                  <option value="overseas-japan">?쇰낯</option>
                  <option value="overseas-southeast-asia">?숇궓??/option>
                  <option value="overseas-americas">誘몄＜/罹먮굹???섏???/option>
                  <option value="overseas-china-hongkong">?留??띿쉘/留덉뭅??/option>
                  <option value="overseas-guam-saipan">愿??ъ씠??/option>
                </optgroup>
                <optgroup label="援?궡?ы뻾">
                  <option value="domestic-hotel">?명뀛</option>
                  <option value="domestic-resort">由ъ“??/option>
                  <option value="domestic-pool-villa">?鍮뚮씪</option>
                </optgroup>
                <optgroup label="?명뀛">
                  <option value="hotel-europe">?좊읇</option>
                  <option value="hotel-japan">?쇰낯</option>
                  <option value="hotel-southeast-asia">?숇궓??/option>
                  <option value="hotel-americas">誘몄＜/罹먮굹???섏???/option>
                  <option value="hotel-china-hongkong">?留??띿쉘/留덉뭅??/option>
                  <option value="hotel-guam-saipan">愿??ъ씠??/option>
                </optgroup>
                <optgroup label="??뀛由?>
                  <option value="luxury-europe">?좊읇</option>
                  <option value="luxury-japan">?쇰낯</option>
                  <option value="luxury-southeast-asia">?숇궓??/option>
                  <option value="luxury-cruise">?щ（利?/option>
                  <option value="luxury-special-theme">?댁깋?뚮쭏</option>
                </optgroup>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                媛寃?<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="price"
                  value={formatNumber(formData.price)}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ??
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ?꾩튂
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="?? ?꾨옉???뚮━, 諛⑹퐬, ?쒖＜??
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ?ы뻾 湲곌컙
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="?? 3諛?4??
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                異쒕컻吏
              </label>
              <input
                type="text"
                name="departure"
                value={formData.departure}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="?? ?몄쿇怨듯빆"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  理쒖냼 ?몄썝
                </label>
                <input
                  type="number"
                  name="min_people"
                  value={formData.min_people}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  理쒕? ?몄썝
                </label>
                <input
                  type="number"
                  name="max_people"
                  value={formData.max_people}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ?쒖옉 ?좎쭨
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  醫낅즺 ?좎쭨
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ?⑦궎吏 ?ㅻ챸
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="?⑦궎吏??????곸꽭 ?ㅻ챸???낅젰?섏꽭??
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  ?⑦궎吏 ?대?吏 URL
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('images')}
                  disabled={formData.images.length >= 10}
                  className={`flex items-center text-sm ${
                    formData.images.length >= 10 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  <Plus size={16} className="mr-1" /> ?대?吏 異붽?
                </button>
              </div>
              
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="mb-4">
                  <div className="flex mb-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'images')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'images')}
                      className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-red-600 hover:text-red-800 hover:bg-red-50"
                      disabled={formData.images.length <= 1}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  {imageUrl && (
                    <div className="relative h-32 w-full md:w-1/2 border rounded-md overflow-hidden bg-gray-50">
                      <img
                        src={imageUrl}
                        alt={`?⑦궎吏 ?대?吏 ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "https://via.placeholder.com/300x200?text=?대?吏+?ㅻ쪟"
                        }}
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          硫붿씤 ?대?吏
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              <p className="text-xs text-gray-500 mt-2">
                泥?踰덉㎏ ?대?吏媛 硫붿씤 ?대?吏濡??ъ슜?⑸땲?? ?대?吏??理쒕? 10媛쒓퉴吏 異붽? 媛?ν빀?덈떎.
              </p>
            </div>
            
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                異붿쿇 ?⑦궎吏 (硫붿씤 ?섏씠吏???쒖떆)
              </label>
            </div>
          </div>
        </div>
        
        {/* ?섏씠?쇱씠??*/}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">?ы뻾 ?섏씠?쇱씠??/h2>
            <button
              type="button"
              onClick={() => addArrayItem('highlights')}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" /> 異붽?
            </button>
          </div>
          
          {formData.highlights.map((highlight, index) => (
            <div key={index} className="flex mb-3">
              <input
                type="text"
                value={highlight}
                onChange={(e) => handleArrayChange(index, e.target.value, 'highlights')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="?ы뻾???밸퀎???먯쓣 湲곗옱?섏꽭??
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'highlights')}
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={formData.highlights.length <= 1}
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Link
            href="/admin/packages"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            痍⑥냼
          </Link>
          
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ???以?..
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" /> ??ν븯湲?
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
/ /   煌  9햆? \胴? 8?? t卵? 붝 ? T堀? 
 
