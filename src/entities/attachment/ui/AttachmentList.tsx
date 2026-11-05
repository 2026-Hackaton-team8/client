import { fileUrl, type Attachment } from "@/shared/api";

type Props = {
  attachments: Attachment[];
};

// Photos and videos attached to a service request; each opens full size in a new tab.
export function AttachmentList({ attachments }: Props) {
  return (
    <ul aria-label="첨부" className="flex flex-wrap gap-3">
      {attachments.map((file) => {
        const url = fileUrl(file.url);
        return (
          <li key={file.fileKey}>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="block size-24 overflow-hidden rounded-lg border-2 border-secondary-100"
            >
              {file.contentType.startsWith("image/") ? (
                // Uploaded files live on the API's storage, outside next/image's configured hosts.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="첨부 사진" className="size-full object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-label-md text-secondary-700">
                  영상
                </span>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
