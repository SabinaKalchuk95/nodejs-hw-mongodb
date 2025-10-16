import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    
    // ✅ ФІКС: email повинен бути unique: true та sparse: true
    email: { type: String, unique: true, sparse: true }, 
    
    isFavorite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    // Згідно з вашим файлом, використовуємо userId:
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' }, 
  },
  { timestamps: true, versionKey: false },
);

// !!! ТИМЧАСОВИЙ КОД ДЛЯ ВИДАЛЕННЯ СТАРОГО ІНДЕКСУ !!!
// Це змусить MongoDB перестворити індекс 'email_1' з опцією sparse: true.
contactsSchema.statics.syncIndexes = async function () {
    console.log("INFO: Forcing index re-sync to fix 'email_1' sparse issue...");
    try {
        // Видаляємо всі індекси колекції
        await this.collection.dropIndexes(); 
        // Примушуємо Mongoose створити нові індекси згідно зі схемою (з sparse: true)
        await this.ensureIndexes(); 
        console.log("SUCCESS: Old indexes dropped and new ones rebuilt.");
    } catch (error) {
        // Обробка помилки, якщо індексів немає, або якщо колекція не знайдена
        if (error.codeName !== 'NamespaceNotFound' && error.code !== 26) {
             console.error("ERROR dropping indexes:", error.message);
        } else {
             console.log("INFO: Collection is new or clean, no index drop needed.");
        }
    }
};
// !!! ПІСЛЯ УСПІШНОГО ТЕСТУ ЦЕЙ БЛОК МОЖНА ВИДАЛИТИ !!!

export const ContactsCollection = model('contacts', contactsSchema);