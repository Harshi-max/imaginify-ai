// "use client";

// import { useToast } from "@/components/ui/use-toast"
// import { dataUrl, getImageSize } from "@/lib/utils";
// import { CldImage, CldUploadWidget } from "next-cloudinary"
// import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
// import Image from "next/image";

// type MediaUploaderProps = {
//   onValueChange: (value: string) => void;
//   setImage: React.Dispatch<any>;
//   publicId: string;
//   image: any;
//   type: string;
// }

// const MediaUploader = ({
//   onValueChange,
//   setImage,
//   image,
//   publicId,
//   type
// }: MediaUploaderProps) => {
//   const { toast } = useToast()

//   const onUploadSuccessHandler = (result: any) => {
//     setImage((prevState: any) => ({
//       ...prevState,
//       publicId: result?.info?.public_id,
//       width: result?.info?.width,
//       height: result?.info?.height,
//       secureURL: result?.info?.secure_url
//     }))

//     onValueChange(result?.info?.public_id)

//     toast({
//       title: 'Image uploaded successfully',
//       description: '1 credit was deducted from your account',
//       duration: 5000,
//       className: 'success-toast' 
//     })
//   }

//   const onUploadErrorHandler = () => {
//     toast({
//       title: 'Something went wrong while uploading',
//       description: 'Please try again',
//       duration: 5000,
//       className: 'error-toast' 
//     })
//   }

//   return (
//     <CldUploadWidget
//       uploadPreset="jsm_imaginify"
//       options={{
//         multiple: false,
//         resourceType: "image",
//       }}
//       onSuccess={onUploadSuccessHandler}
//       onError={onUploadErrorHandler}
//     >
//       {({ open }) => (
//         <div className="flex flex-col gap-4">
//           <h3 className="h3-bold text-dark-600">
//             Original
//           </h3>

//           {publicId ? (
//             <>
//               <div className="cursor-pointer overflow-hidden rounded-[10px]">
//                 <CldImage 
//                   width={getImageSize(type, image, "width")}
//                   height={getImageSize(type, image, "height")}
//                   src={publicId}
//                   alt="image"
//                   sizes={"(max-width: 767px) 100vw, 50vw"}
//                   placeholder={dataUrl as PlaceholderValue}
//                   className="media-uploader_cldImage"
//                 />
//               </div>
//             </>
//           ): (
//             <div className="media-uploader_cta" onClick={() => open()}>
//               <div className="media-uploader_cta-image">
//                 <Image 
//                   src="/assets/icons/add.svg"
//                   alt="Add Image"
//                   width={24}
//                   height={24}
//                 />
//               </div>
//                 <p className="p-14-medium">Click here to upload image</p>
//             </div>
//           )}
//         </div>
//       )}
//     </CldUploadWidget>
//   )
// }

// export default MediaUploader

"use client";

import { useToast } from "@/components/ui/use-toast";
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
};

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type,
}: MediaUploaderProps) => {
  const { toast } = useToast();

  const onUploadSuccessHandler = (result: any) => {
    const info = result?.info;

    if (!info?.public_id || !info?.secure_url) {
      toast({
        title: "Upload failed",
        description: "Incomplete image info returned from Cloudinary.",
        duration: 5000,
        className: "error-toast",
      });
      return;
    }

    setImage((prevState: any) => ({
      ...prevState,
      publicId: info.public_id,
      width: info.width,
      height: info.height,
      secureURL: info.secure_url,
    }));

    onValueChange(info.public_id);

    toast({
      title: "Image uploaded successfully",
      description: "1 credit was deducted from your account",
      duration: 5000,
      className: "success-toast",
    });
  };

  const onUploadErrorHandler = (error?: any) => {
    console.error("Cloudinary Upload Error:", error);
    toast({
      title: "Upload Error",
      description: "Something went wrong while uploading. Please try again.",
      duration: 5000,
      className: "error-toast",
    });
  };

  return (
    <CldUploadWidget
      uploadPreset="jsm_imaginify"
      options={{
        multiple: false,
        resourceType: "image",
        cropping: false,
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {(widget) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-dark-600">Original</h3>

          {publicId ? (
            <div className="cursor-pointer overflow-hidden rounded-[10px]">
              <CldImage
                width={getImageSize(type, image, "width")}
                height={getImageSize(type, image, "height")}
                src={publicId}
                alt="Uploaded Image"
                sizes="(max-width: 767px) 100vw, 50vw"
                placeholder={dataUrl as PlaceholderValue}
                className="media-uploader_cldImage"
                crop="pad"
                gravity="auto"
                effect="gen_fill"
              />
            </div>
          ) : (
            <div
              className="media-uploader_cta"
              onClick={() => widget?.open?.()}
            >
              <div className="media-uploader_cta-image">
                <Image
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={24}
                  height={24}
                />
              </div>
              <p className="p-14-medium">Click here to upload image</p>
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;

