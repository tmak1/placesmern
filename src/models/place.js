import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true },
    coordinates: {
      lat: { type: Number, trim: true, required: true },
      lng: { type: Number, trim: true, required: true },
    },
    imageUrl: { type: String, trim: true, required: true },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
);

placeSchema.methods.toJSON = function () {
  const placeObj = this.toObject({ getters: true });
  delete placeObj.createdAt;
  delete placeObj.updatedAt;
  // delete placeObj.imageUrl;
  placeObj.placeId = placeObj.id;
  delete placeObj.id;
  delete placeObj['__v'];
  delete placeObj['_id'];
  return placeObj;
};

const Place = mongoose.model('place', placeSchema);

export default Place;
