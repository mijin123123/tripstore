'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Plus, X, Save, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import Link from 'next/link'

export default function CreatePackage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImages, setUploadingImages] = useState<number[]>([])

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    duration: '',
    region: '',
    regionKo: '',
    description: '',
    image: '',
    images: [''], // ���� �̹����� ���� �迭
    highlights: [''],
    departure: '',
    type: '',
    min_people: 1,
    max_people: 10,
    itinerary: '',
    included: [''],
    excluded: [''],
    notes: [''],
    is_featured: false,
    category: '',
    location: ''
  })

  // ���ڸ� õ ���� �޸� �������� ��ȯ�ϴ� �Լ�
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR')
  }

  // �̹��� ������ Base64�� ��ȯ�ϴ� �Լ�
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // ���� �ؽ�Ʈ�� �̹��� �ٿ��ֱ� �ڵ鷯
  const handleItineraryPaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // �̹��� ������ ���
      if (item.type.startsWith('image/')) {
        e.preventDefault(); // �⺻ �ٿ��ֱ� ����
        
        const file = item.getAsFile();
        if (file) {
          try {
            const base64 = await convertToBase64(file);
            const currentValue = formData.itinerary;
            const textarea = e.target as HTMLTextAreaElement;
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            
            // �̹��� ��ũ�ٿ� �������� ����
            const imageMarkdown = `![�̹���](${base64})`;
            const newValue = currentValue.substring(0, startPos) + imageMarkdown + currentValue.substring(endPos);
            
            setFormData({ ...formData, itinerary: newValue });
            
            // Ŀ�� ��ġ�� �̹��� �±� �ڷ� �̵�
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = startPos + imageMarkdown.length;
              textarea.focus();
            }, 0);
          } catch (error) {
            console.error('�̹��� ��ȯ ����:', error);
            alert('�̹��� ó�� �� ������ �߻��߽��ϴ�.');
          }
        }
        break;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (name === 'price') {
      // �޸� ���� �� ���ڸ� ����
      const numericValue = value.replace(/[^\d]/g, '')
      setFormData({ ...formData, [name]: parseInt(numericValue) || 0 })
    } else if (name === 'min_people' || name === 'max_people') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 })
    } else if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
    } else if (name === 'category') {
      // ī�װ� ���� �� type�� region �ڵ� ����
      let newType = '';
      let newRegion = '';
      let newRegionKo = '';
      
      if (value === 'overseas-europe') {
        newType = 'overseas';
        newRegion = 'europe';
        newRegionKo = '����';
      } else if (value === 'overseas-japan') {
        newType = 'overseas';
        newRegion = 'japan';
        newRegionKo = '�Ϻ�';
      } else if (value === 'overseas-southeast-asia') {
        newType = 'overseas';
        newRegion = 'southeast-asia';
        newRegionKo = '������';
      } else if (value === 'overseas-americas') {
        newType = 'overseas';
        newRegion = 'americas';
        newRegionKo = '����/ĳ����/�Ͽ���';
      } else if (value === 'overseas-taiwan-hongkong-macau') {
        newType = 'overseas';
        newRegion = 'taiwan-hongkong-macau';
        newRegionKo = '�븸/ȫ��/��ī��';
      } else if (value === 'overseas-guam-saipan') {
        newType = 'overseas';
        newRegion = 'guam-saipan';
        newRegionKo = '��/������';
      } else if (value === 'domestic-hotel') {
        newType = 'domestic';
        newRegion = 'hotel';
        newRegionKo = 'ȣ��/����Ʈ';
      } else if (value === 'domestic-pool-villa') {
        newType = 'domestic';
        newRegion = 'pool-villa';
        newRegionKo = 'Ǯ����/���';
      } else if (value === 'luxury-europe') {
        newType = 'luxury';
        newRegion = 'europe';
        newRegionKo = '����';
      } else if (value === 'luxury-japan') {
        newType = 'luxury';
        newRegion = 'japan';
        newRegionKo = '�Ϻ�';
      } else if (value === 'luxury-southeast-asia') {
        newType = 'luxury';
        newRegion = 'southeast-asia';
        newRegionKo = '������';
      } else if (value === 'luxury-cruise') {
        newType = 'luxury';
        newRegion = 'cruise';
        newRegionKo = 'ũ����';
      } else if (value === 'luxury-special-theme') {
        newType = 'luxury';
        newRegion = 'special-theme';
        newRegionKo = '�̻��׸�';
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
      alert('�̹����� �ִ� 10�������� �߰��� �� �ֽ��ϴ�.');
      return;
    }
    const newArray = [...formData[field], '']
    setFormData({ ...formData, [field]: newArray })
  }

  const removeArrayItem = (index: number, field: 'highlights' | 'included' | 'excluded' | 'notes' | 'images') => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: newArray })
  }

  // �̹��� ���� ���� �Լ���
  const moveImageUp = (index: number) => {
    if (index === 0) return
    const newImages = [...formData.images]
    const temp = newImages[index]
    newImages[index] = newImages[index - 1]
    newImages[index - 1] = temp
    setFormData({ ...formData, images: newImages })
  }

  const moveImageDown = (index: number) => {
    if (index === formData.images.length - 1) return
    const newImages = [...formData.images]
    const temp = newImages[index]
    newImages[index] = newImages[index + 1]
    newImages[index + 1] = temp
    setFormData({ ...formData, images: newImages })
  }

  // �巡�� �� ��� ���� ����
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newImages = [...formData.images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)
    
    setFormData({ ...formData, images: newImages })
    setDraggedIndex(null)
  }

  // ���� ���ε� ó�� �Լ�
  const handleFileUpload = async (file: File, index: number): Promise<void> => {
    if (!file) return

    // ���� Ÿ�� üũ
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      alert('JPG, PNG, WebP, GIF, AVIF ���ϸ� ���ε� �����մϴ�.')
      return
    }

    // ���� ũ�� üũ (5MB ����)
    if (file.size > 5 * 1024 * 1024) {
      alert('���� ũ��� 5MB ���Ϸ� ���ѵ˴ϴ�.')
      return
    }

    try {
      setUploadingImages(prev => [...prev, index])
      
      const supabase = createClient()
      
      // ���� ����� Ȯ��
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('����� ���� ����:', userError)
        alert('�α����� �ʿ��մϴ�.')
        return
      }

      console.log('���� �����:', user.email)
      
      // ���ϸ� ���� (Ÿ�ӽ����� + ���� ���ڿ�)
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `packages/${fileName}`

      console.log('���ε� �õ�:', {
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type,
        targetIndex: index
      })

      // Supabase Storage�� ���� ���ε�
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        })

      if (error) {
        console.error('���� ���ε� ����:', {
          error,
          message: error.message,
          statusCode: error.statusCode
        })
        
        if (error.message?.includes('already exists')) {
          alert('���� �̸��� ������ �̹� �����մϴ�. �ٽ� �õ����ּ���.')
        } else if (error.message?.includes('not allowed')) {
          alert('���� ������ ������ �ʽ��ϴ�.')
        } else if (error.message?.includes('size')) {
          alert('���� ũ�Ⱑ �ʹ� Ů�ϴ�.')
        } else {
          alert(`���� ���ε忡 �����߽��ϴ�: ${error.message}`)
        }
        return
      }

      console.log('���ε� ����:', data)

      // ���ε�� ������ ���� URL ��������
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      console.log('���� URL:', publicUrl)

      // �� ������ ������Ʈ (�Լ��� ������Ʈ�� �ֽ� ���� ����)
      setFormData(prev => {
        const newImages = [...prev.images]
        newImages[index] = publicUrl
        return { ...prev, images: newImages }
      })

      console.log(`�̹��� ${index + 1} ���ε� �Ϸ�:`, publicUrl)

    } catch (error) {
      console.error('���� ���ε� �� ����:', error)
      alert(`���� ���ε� �� ������ �߻��߽��ϴ�: ${error}`)
    } finally {
      setUploadingImages(prev => prev.filter(i => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // �ʼ� �ʵ� ����
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error('�ʼ� �ʵ带 ��� �Է����ּ���. (�̸�, ����, ī�װ�)')
      }
      
      // �迭 �ʵ忡�� �� �׸� ���͸�
      const highlights = formData.highlights.filter(item => item.trim() !== '')
      const included = formData.included.filter(item => item.trim() !== '')
      const excluded = formData.excluded.filter(item => item.trim() !== '')
      const notes = formData.notes.filter(item => item.trim() !== '')
      const images = formData.images.filter(item => item.trim() !== '')
      
      // �����ͺ��̽� ���� �غ�
      const supabase = createClient()
      
      // ������ ��Ű�� ID ����
      const packageId = `pkg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const { error } = await supabase
        .from('packages')
        .insert({
          id: packageId,
          title: formData.name,
          price: formData.price.toString(),
          region: formData.region,
          region_ko: formData.regionKo || '',
          type: formData.type,
          description: formData.description || '',
          image: images.length > 0 ? images[0] : '',
          images: images, // �̹��� �迭 ����
          is_featured: formData.is_featured,
          duration: formData.duration || '',
          departure: formData.departure || '',
          highlights: highlights.length ? highlights : [''],
          itinerary: formData.itinerary || '',
          included: included.length ? included : [''],
          excluded: excluded.length ? excluded : [''],
          notes: notes.length ? notes : [''],
          min_people: formData.min_people || 1,
          max_people: formData.max_people || 10,
          rating: 4.5 // �⺻ ����
        })
      
      if (error) throw error
      
      console.log('��Ű�� ���� ����:', packageId)
      
      // ���� �� �ش� ��Ű�� �� �������� �̵��Ͽ� ��� ��� Ȯ��
      alert(`��Ű���� ���������� �����Ǿ����ϴ�! (ID: ${packageId})`)
      
      // ��Ű�� ��ϰ� �ش� ��Ű�� ������ ��� ���ΰ�ħ
      router.push(`/package/${packageId}`)
      router.refresh()
      
    } catch (error: any) {
      console.error('��Ű�� ���� ����:', error)
      setError(error.message || '��Ű�� ���� �� ������ �߻��߽��ϴ�')
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
          <h1 className="text-2xl font-bold">��Ű�� �߰�</h1>
        </div>
        <div className="flex space-x-2">
          <a href="#itinerary-section" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100">
            �� ����
          </a>
          <a href="#included-section" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100">
            ���� ����
          </a>
          <a href="#excluded-section" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100">
            ������ ����
          </a>
          <a href="#notes-section" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100">
            �������
          </a>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* �⺻ ���� */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">�⺻ ����</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ��Ű���� <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ī�װ� <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">ī�װ� ����</option>
                <optgroup label="�ؿܿ���">
                  <option value="overseas-europe">����</option>
                  <option value="overseas-japan">�Ϻ�</option>
                  <option value="overseas-southeast-asia">������</option>
                  <option value="overseas-americas">����/ĳ����/�Ͽ���</option>
                  <option value="overseas-taiwan-hongkong-macau">�븸/ȫ��/��ī��</option>
                  <option value="overseas-guam-saipan">��/������</option>
                </optgroup>
                <optgroup label="��������">
                  <option value="domestic-hotel">ȣ��/����Ʈ</option>
                  <option value="domestic-pool-villa">Ǯ����/���</option>
                </optgroup>
                <optgroup label="���Ÿ�">
                  <option value="luxury-europe">����</option>
                  <option value="luxury-japan">�Ϻ�</option>
                  <option value="luxury-southeast-asia">������</option>
                  <option value="luxury-cruise">ũ����</option>
                  <option value="luxury-special-theme">�̻��׸�</option>
                </optgroup>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ���� <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="price"
                  value={formatNumber(formData.price)}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ��
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ��ġ
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="��: ������ �ĸ�, ����, ���ֵ�"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ���� �Ⱓ
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="��: 3�� 4��"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                �����
              </label>
              <input
                type="text"
                name="departure"
                value={formData.departure}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="��: ��õ����"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ��ġ
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="��: ����"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  �ּ� �ο�
                </label>
                <input
                  type="number"
                  name="min_people"
                  value={formData.min_people}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  �ִ� �ο�
                </label>
                <input
                  type="number"
                  name="max_people"
                  value={formData.max_people}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ��Ű�� ����
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="��Ű���� ���� �� ������ �Է��ϼ���"
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  ��Ű�� �̹���
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
                  <Plus size={16} className="mr-1" /> �̹��� �߰�
                </button>
              </div>
              
              {/* ���� ���� ���ε� ���� */}
              <div className="mb-3 p-3 border border-dashed border-gray-300 rounded-md bg-gray-50">
                <div className="text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || [])
                      if (files.length > 0) {
                        console.log(`${files.length}�� ���� ���õ�`)
                        
                        // ���� ���� ���� ���� Ȯ��
                        const usedSlots = formData.images.filter(img => img.trim()).length
                        
                        // �ִ� 10�� ���� Ȯ��
                        if (usedSlots + files.length > 10) {
                          alert(`�̹����� �ִ� 10�������� ���ε� �����մϴ�. ���� ${usedSlots}�� ��ϵ�, ${files.length}�� ���õ�`)
                          e.target.value = ''
                          return
                        }
                        
                        // �ʿ��� ��ŭ �̹��� ���� Ȯ��
                        const currentImages = [...formData.images]
                        while (currentImages.length < usedSlots + files.length) {
                          currentImages.push('')
                        }
                        
                        // ���� ������Ʈ
                        setFormData(prev => ({ ...prev, images: currentImages }))
                        
                        // ���������� ���� ���ε�
                        let uploadIndex = 0
                        for (const [fileIndex, file] of files.entries()) {
                          try {
                            // �� ���� ã��
                            while (uploadIndex < currentImages.length && currentImages[uploadIndex].trim() !== '') {
                              uploadIndex++
                            }
                            
                            if (uploadIndex < 10) {
                              console.log(`���� ${fileIndex + 1}/${files.length} ���ε� ���� (���� ${uploadIndex})`)
                              await handleFileUpload(file, uploadIndex)
                              // ���ε� �Ϸ� �� �ش� ������ �������� ǥ��
                              currentImages[uploadIndex] = 'uploading' // �ӽ� ǥ��
                              uploadIndex++
                            }
                          } catch (error) {
                            console.error(`���� ${fileIndex + 1} ���ε� ����:`, error)
                          }
                        }
                        
                        e.target.value = '' // �Է� �ʱ�ȭ
                        console.log('��� ���� ���ε� �Ϸ�')
                      }
                    }}
                    className="hidden"
                    id="multipleFileUpload"
                    disabled={uploadingImages.length > 0}
                  />
                  <label 
                    htmlFor="multipleFileUpload" 
                    className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
                      uploadingImages.length > 0 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Plus size={14} className="mr-1" />
                    {uploadingImages.length > 0 ? '���ε� ��...' : '���� �̹��� �ѹ��� ���ε�'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    �ִ� 10������ ���� ���� (�� ���� 5MB ����)
                    {uploadingImages.length > 0 && (
                      <span className="text-blue-600 block mt-1">
                        ���ε� ���� ��: {uploadingImages.length}��
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              {formData.images.map((imageUrl, index) => (
                <div 
                  key={index} 
                  className={`mb-2 p-2 border rounded-md transition-all ${
                    draggedIndex === index ? 'opacity-50' : ''
                  } ${draggedIndex !== null && draggedIndex !== index ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="flex items-center space-x-2">
                    {/* �巡�� �ڵ� �� ���� ���� ��ư */}
                    <div className="flex flex-col items-center space-y-1">
                      <GripVertical size={12} className="text-gray-400 cursor-move" />
                      <div className="flex flex-col space-y-0.5">
                        <button
                          type="button"
                          onClick={() => moveImageUp(index)}
                          disabled={index === 0}
                          className={`p-0.5 rounded ${
                            index === 0 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <ChevronUp size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImageDown(index)}
                          disabled={index === formData.images.length - 1}
                          className={`p-0.5 rounded ${
                            index === formData.images.length - 1 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <ChevronDown size={10} />
                        </button>
                      </div>
                    </div>

                    {/* �̹��� ������ */}
                    <div className="flex-shrink-0">
                      {imageUrl && (
                        <div className="relative h-20 w-28 border rounded overflow-hidden bg-gray-50">
                          <img
                            src={imageUrl}
                            alt={`��Ű�� �̹��� ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              if (!target.dataset.retried) {
                                target.dataset.retried = 'true'
                                setTimeout(() => {
                                  target.src = imageUrl + '?t=' + Date.now()
                                }, 1000)
                              } else {
                                target.src = "https://via.placeholder.com/300x200?text=�̹���+�ε�+����"
                              }
                            }}
                            onLoad={() => {
                              console.log(`�̹��� ${index + 1} �ε� ����:`, imageUrl.substring(0, 50) + '...')
                            }}
                          />
                          {index === 0 && (
                            <div className="absolute top-0.5 left-0.5 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                              ����
                            </div>
                          )}
                          <div className="absolute top-0.5 right-0.5 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                            {index + 1}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ���� ���ε� �� URL */}
                    <div className="flex-1 min-w-0 max-w-md">
                      <div className="flex items-center space-x-1 mb-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload(file, index)
                              e.target.value = ''
                            }
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          disabled={uploadingImages.includes(index)}
                        />
                        
                        {/* ���� ��ư */}
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'images')}
                          className="px-2 py-1 border border-gray-300 rounded text-red-600 hover:text-red-800 hover:bg-red-50"
                          disabled={formData.images.length <= 1}
                        >
                          <X size={12} />
                        </button>
                      </div>

                      {/* �̹��� URL ���� */}
                      {imageUrl && (
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => handleArrayChange(index, e.target.value, 'images')}
                          className="w-full max-w-sm px-1 py-0.5 border border-gray-200 rounded text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-300"
                          placeholder="�̹��� URL"
                          readOnly={uploadingImages.includes(index)}
                        />
                      )}

                      {/* ���ε� ���� ǥ�� */}
                      {uploadingImages.includes(index) && (
                        <div className="text-xs text-blue-600 mt-1 flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                          ���ε� ��...
                        </div>
                      )}
                      
                      {formData.images[index] && formData.images[index].trim() !== '' && !uploadingImages.includes(index) && (
                        <div className="text-xs text-green-600 mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          �Ϸ�
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <p className="text-xs text-gray-500 mt-4">
                ? ù ��° �̹����� ���� �̹����� ���˴ϴ�.<br/>
                ? �巡���ϰų� ��/�Ʒ� ��ư���� �̹��� ������ ������ �� �ֽ��ϴ�.<br/>
                ? "���� �̹��� �ѹ��� ���ε�" ��ư���� �ִ� 10������ �����Ͽ� �ѹ��� ���ε� ����<br/>
                ? �̹��� ���� ũ��� 5MB ���Ϸ� ���ѵ˴ϴ�.<br/>
                ? ���� ����: JPEG, PNG, WebP, GIF, AVIF<br/>
                ? �̹����� �ִ� 10������ �߰� �����մϴ�.
              </p>
            </div>
            
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                ��õ ��Ű�� (���� �������� ǥ��)
              </label>
            </div>
          </div>
        </div>
        
        {/* ���̶���Ʈ */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">���� ���̶���Ʈ</h2>
            <button
              type="button"
              onClick={() => addArrayItem('highlights')}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" /> �߰�
            </button>
          </div>
          
          {formData.highlights.map((highlight, index) => (
            <div key={index} className="flex mb-3">
              <input
                type="text"
                value={highlight}
                onChange={(e) => handleArrayChange(index, e.target.value, 'highlights')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="������ Ư���� ���� �����ϼ���"
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

        {/* ���� ���� */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200" id="itinerary-section">
          <h2 className="text-lg font-semibold mb-4">���� ����</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ���� ���� 
              <span className="text-gray-500 text-xs ml-1">(��: 3�� 4��, �ƽþƳ��װ�, �ϳ���-����-������(1))</span>
            </label>
            <textarea
              value={formData.itinerary}
              onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
              onPaste={handleItineraryPaste}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="������ ���� ������ �Է��ϼ���&#10;��: 3�� 4��&#10;�ƽþƳ��װ�&#10;�ϳ���-����-������(1)&#10;&#10;?? �̹����� �ٿ��ֱ� �����մϴ�!"
            />
          </div>
        </div>

        {/* ���� ���� */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200" id="included-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">���� ����</h2>
            <button
              type="button"
              onClick={() => addArrayItem('included')}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" /> �߰�
            </button>
          </div>
          
          {formData.included.map((item, index) => (
            <div key={index} className="flex mb-3">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(index, e.target.value, 'included')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="���ԵǴ� �׸��� �Է��ϼ���"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'included')}
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={formData.included.length <= 1}
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* ������ ���� */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200" id="excluded-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">������ ����</h2>
            <button
              type="button"
              onClick={() => addArrayItem('excluded')}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" /> �߰�
            </button>
          </div>
          
          {formData.excluded.map((item, index) => (
            <div key={index} className="flex mb-3">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(index, e.target.value, 'excluded')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="���Ե��� �ʴ� �׸��� �Է��ϼ���"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'excluded')}
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={formData.excluded.length <= 1}
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* ���� �� ������� */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200" id="notes-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">���� �� �������</h2>
            <button
              type="button"
              onClick={() => addArrayItem('notes')}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" /> �߰�
            </button>
          </div>
          
          {formData.notes.map((note, index) => (
            <div key={index} className="flex mb-3">
              <input
                type="text"
                value={note}
                onChange={(e) => handleArrayChange(index, e.target.value, 'notes')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="���ǻ����̳� ������ ������ �Է��ϼ���"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'notes')}
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={formData.notes.length <= 1}
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
            ���
          </Link>
          
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ���� ��...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" /> ��Ű�� ����
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
