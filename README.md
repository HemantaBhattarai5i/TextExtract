# 👁️ TextExtract Studio

TextExtract Studio is a premium, high-performance web application designed to transform visual data into editable digital text. Built with a focus on precision and user experience, it leverages advanced OCR (Optical Recognition) technology to provide a seamless vision-processing environment.

![TextExtract Studio](https://raw.githubusercontent.com/lucide-react/lucide/main/icons/eye.svg)

## ✨ Key Features

- **🚀 Instant OCR Processing**: Powered by Tesseract.js for high-accuracy text extraction directly in the browser.
- **📸 Multi-Source Input**: 
    - **Drag & Drop**: Effortlessly upload images from your device.
    - **Webcam Capture**: Capture live images for immediate processing.
- **✂️ Advanced Image Cropping**: Refine your images before processing to ensure maximum OCR precision using `react-easy-crop`.
- **🔐 Secure Authentication**: Integrated with Clerk for robust user management and secure access.
- **📊 Real-time Progress Tracking**: Visual feedback during the OCR process with a sleek progress bar.
- **🎨 Premium UI/UX**:
    - Built with **React** and **TypeScript**.
    - Styled with **Tailwind CSS** and **Radix UI** for a modern, accessible interface.
    - Smooth animations powered by **Framer Motion**.
    - Responsive design for all devices.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **OCR Engine**: [Tesseract.js](https://tesseract.projectnaptha.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Auth**: [Clerk](https://clerk.com/)
- **Image Handling**: [react-dropzone](https://react-dropzone.js.org/), [react-easy-crop](https://github.com/valentinhuber/react-easy-crop), [react-webcam](https://github.com/mozmorris/react-webcam)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/ocr-project.git
   cd ocr-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add your Clerk credentials:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## 📖 Usage

1. **Sign In**: Create an account or sign in using the Clerk authentication portal.
2. **Upload/Capture**: Choose an image from your computer or use your webcam to take a picture.
3. **Crop**: (Optional) Use the cropping tool to select the specific area of the image containing the text you want to extract.
4. **Process**: Click the process button and watch the progress bar as TextExtract Studio analyzes the image.
5. **Copy/Edit**: Once finished, your extracted text will be available for copying or further editing.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Created & Owned by Hemanta Bhattarai**  

