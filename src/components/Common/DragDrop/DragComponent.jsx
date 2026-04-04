import { CustomDragDrop } from "./CustomDragDrop";

export default function DragComponent({
  ownerLicense,
  setOwnerLicense,
  counts,
}) {
  function uploadFiles(f) {
    setOwnerLicense([...ownerLicense, ...f]);
  }

  function deleteFile(indexImg) {
    const updatedList = ownerLicense.filter((ele, index) => index !== indexImg);
    setOwnerLicense(updatedList);
  }

  return (
    <div className="w-full px-5 pt-3 pb-5">
      <CustomDragDrop
        ownerLicense={ownerLicense}
        onUpload={uploadFiles}
        onDelete={deleteFile}
        count={counts ? counts : 2}
        formats={["jpg", "jpeg", "png"]}
      />
    </div>
  );
}
