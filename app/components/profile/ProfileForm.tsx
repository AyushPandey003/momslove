'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Profile } from '@/app/lib/profiles';
import { useUploadThing } from '@/app/uploadthing';

export default function ProfileForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  
  // Setup uploadthing
  const { startUpload: startProfileUpload, isUploading: isProfileUploading } = useUploadThing("profileImage");
  const { startUpload: startGalleryUpload, isUploading: isGalleryUploading } = useUploadThing("galleryImages");
  
  // Profile data state
  const [profile, setProfile] = useState<Partial<Profile>>({
    bio: '',
    location: '',
    website: '',
    twitter: '',
    instagram: '',
    facebook: '',
    phone_number: '',
    display_email: false,
    profile_image: null,
    gallery_images: []
  });
  
  // Load profile data on component mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        
        if (res.status === 404) {
          // Profile doesn't exist yet, that's ok
          setLoading(false);
          return;
        }
        
        if (!res.ok) {
          throw new Error('Failed to load profile');
        }
        
        const data = await res.json();
        setProfile(data.profile);
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    if (session) {
      loadProfile();
    }
  }, [session]);
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!acceptedTypes.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image');
      return;
    }
    
    try {
      setUploadingImage(true);
      setError(null);
      
      // Upload to UploadThing
      const uploadResult = await startProfileUpload([file]);
      
      if (!uploadResult || !uploadResult[0]) {
        throw new Error('Upload failed');
      }
      
      const imageUrl = uploadResult[0].url;
      
      // Save the URL to our profile
      const res = await fetch('/api/profile/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl })
      });
      
      if (!res.ok) {
        throw new Error('Failed to save image URL');
      }
      
      // Update profile state with new image URL
      setProfile(prev => ({
        ...prev,
        profile_image: imageUrl
      }));
      
      setSuccess('Profile image updated successfully');
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };
  
  // Handle gallery image upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Convert FileList to array
    const fileArray = Array.from(files).slice(0, 5); // Limit to 5 files
    
    // Validate file types
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = fileArray.filter(file => !acceptedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError('Please upload only JPEG, PNG, or WebP images');
      return;
    }
    
    try {
      setUploadingGallery(true);
      setError(null);
      
      // Upload to UploadThing
      const uploadResults = await startGalleryUpload(fileArray);
      
      if (!uploadResults || uploadResults.length === 0) {
        throw new Error('Upload failed');
      }
      
      // Extract URLs from upload results
      const newImageUrls = uploadResults.map(result => result.url);
      
      // Get existing gallery images
      const existingUrls = profile.gallery_images || [];
      
      // Combine existing and new URLs (up to a max of 10 total)
      const combinedUrls = [...existingUrls, ...newImageUrls].slice(0, 10);
      
      // Save the URLs to our profile
      const res = await fetch('/api/profile/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrls: combinedUrls })
      });
      
      if (!res.ok) {
        throw new Error('Failed to save gallery images');
      }
      
      // Update profile state with new gallery images
      setProfile(prev => ({
        ...prev,
        gallery_images: combinedUrls
      }));
      
      setSuccess('Gallery images updated successfully');
    } catch (err) {
      setError('Failed to upload gallery images. Please try again.');
      console.error(err);
    } finally {
      setUploadingGallery(false);
    }
  };
  
  // Remove a gallery image
  const removeGalleryImage = async (indexToRemove: number) => {
    try {
      setError(null);
      
      // Get existing gallery images
      const existingUrls = profile.gallery_images || [];
      
      // Remove the image at the specified index
      const updatedUrls = existingUrls.filter((_, index) => index !== indexToRemove);
      
      // Save the updated URLs to our profile
      const res = await fetch('/api/profile/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrls: updatedUrls })
      });
      
      if (!res.ok) {
        throw new Error('Failed to update gallery images');
      }
      
      // Update profile state
      setProfile(prev => ({
        ...prev,
        gallery_images: updatedUrls
      }));
      
      setSuccess('Gallery image removed successfully');
    } catch (err) {
      setError('Failed to remove gallery image. Please try again.');
      console.error(err);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      setError('You must be logged in to update your profile');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });
      
      if (!res.ok) {
        throw new Error('Failed to update profile');
      }
      
      await res.json();
      setSuccess('Profile updated successfully');
      
      // Refresh the page data
      router.refresh();
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              {profile.profile_image ? (
                <Image
                  src={profile.profile_image}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zm-4 7a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                </div>
              )}
            </div>
            
            {(uploadingImage || isProfileUploading) && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-medium
                file:bg-black file:text-white
                hover:file:bg-gray-800"
              disabled={isProfileUploading || uploadingImage}
            />
            <p className="mt-1 text-xs text-gray-500">
              JPG, PNG or WebP. Max 2MB.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Gallery Images</h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload images to display in your profile gallery (maximum 10 images)
        </p>
        
        {/* Gallery image upload */}
        <div className="mb-6">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleGalleryUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-medium
              file:bg-black file:text-white
              hover:file:bg-gray-800"
            multiple
            disabled={isGalleryUploading || uploadingGallery}
          />
          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG or WebP. Max 4MB each. Up to 5 images at once.
          </p>
          
          {(uploadingGallery || isGalleryUploading) && (
            <div className="mt-2 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black mr-2"></div>
              <span className="text-sm">Uploading gallery images...</span>
            </div>
          )}
        </div>
        
        {/* Gallery image preview */}
        {profile.gallery_images && profile.gallery_images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {profile.gallery_images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            value={profile.bio || ''}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={profile.location || ''}
              onChange={handleChange}
              placeholder="City, Country"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={profile.website || ''}
              onChange={handleChange}
              placeholder="https://example.com"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>
        
        <h3 className="text-lg font-medium pt-2">Social Media</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
              Twitter/X
            </label>
            <input
              type="text"
              id="twitter"
              name="twitter"
              value={profile.twitter || ''}
              onChange={handleChange}
              placeholder="@username"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          
          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={profile.instagram || ''}
              onChange={handleChange}
              placeholder="username"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          
          <div>
            <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="text"
              id="facebook"
              name="facebook"
              value={profile.facebook || ''}
              onChange={handleChange}
              placeholder="username or profile URL"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={profile.phone_number || ''}
              onChange={handleChange}
              placeholder="+1 (555) 555-5555"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="display_email"
              name="display_email"
              checked={profile.display_email || false}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="display_email" className="text-sm text-gray-700">
              Display my email on my public profile
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            Your email is {session?.user?.email}
          </p>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
} 