Flashbackapp is a cross-platform mobile application built with React Native and Expo, designed to help users capture, organize, and share memories through photos and events. The app integrates camera functionality, photo management, event scheduling, and social sharing, all backed by Firebase for authentication and data storage.
Features
User Authentication:
Secure login and registration using Firebase Authentication. User data is stored and managed securely.
Create Memories:
Users can create new "memories" by entering a title and proceeding to add photos, set event dates, and configure sharing options.
Photo Capture & Upload:
Integrated camera and gallery picker allow users to take new photos or select existing ones to attach to their memories.
Event Scheduling:
Users can set start and end dates for their memories, making it easy to organize events or time-bound photo collections.
Gallery & Swiper:
Memories can include multiple photos, which are viewable in a swipeable gallery interface.
QR Code & Barcode Integration:
Users can generate and scan QR codes to join or share memories/events with others.
Guest Management:
Set limits on the number of guests and photos per memory, and manage who can view or contribute to each event.
Settings & Customization:
Users can access a settings screen to manage their account and app preferences.
Cloud Storage & Sync:
All data is synced with Firebase, ensuring memories are backed up and accessible across devices.

Getting Started
Prerequisites
Node.js (v16+ recommended)
npm or yarn
Expo CLI (npm install -g expo-cli)
Android Studio or Xcode for device emulation (or a physical device)
Firebase project (for authentication and database)
Installation
Clone the repository:
Run
Install dependencies:
Run
Configure Firebase:
Add your google-services.json (Android) and Firebase config to the project as needed.
Update any Firebase configuration in App.js or related files.
Start the app:
Use the Expo Go app or an emulator to run the project.
Project Structure


Key Dependencies
React Native: UI framework
Expo: Development platform and build tools
Firebase: Authentication and real-time database
@react-navigation: Navigation and routing
expo-image-picker: Camera and gallery access
react-native-qrcode-svg: QR code generation
react-native-calendars: Calendar and date picking
react-native-swiper: Swipable photo galleries
Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.
License
MIT License
Note:
Update the Firebase configuration and any API keys before publishing or sharing the repository.
