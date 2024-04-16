// ignore_for_file: unnecessary_new, prefer_collection_literals

export class ImageAttachmentModel {
  constructor(
    public id: string,
    public seqNo: string,
    public imgUrl: string,
    public imgDescription: string,
    public imgRemarks: string,
  ) {
    return {
      id,
      seqNo,
      imgUrl,
      imgDescription,
      imgRemarks,
    }
  }
}