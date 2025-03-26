# Chat App

A React Native iOS application that uses the Anthropic API to have conversations with Claude. The app allows users to have multiple conversations, switch between them, and create new ones.

## Features

- Chat with Claude using the Anthropic API
- Modern UI that clearly differentiates between user and assistant messages
- Local storage for saving and resuming conversations
- No login required - all data is stored locally on the device
- Create new chats with a single tap
- Browse and switch between previous conversations

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- CocoaPods (for iOS)
- Xcode (for iOS)
- Anthropic API key

### Installation

1. Clone the repository
```
git clone https://github.com/bhouston/chat-app.git
cd chat-app
```

2. Install dependencies
```
npm install
```

3. Install CocoaPods (for iOS)
```
cd ios && pod install && cd ..
```

4. Add your Anthropic API key
Open `src/services/anthropicService.ts` and replace `YOUR_ANTHROPIC_API_KEY` with your actual API key.

### Running the App

#### iOS
```
npm run ios
```

## Project Structure

- `src/components`: Reusable UI components
- `src/screens`: Main application screens
- `src/services`: API services
- `src/contexts`: React context providers
- `src/utils`: Utility functions
- `src/types`: TypeScript type definitions
- `src/hooks`: Custom React hooks

## Future Improvements

- Secure API key storage
- User authentication
- Chat history search
- Message attachments
- Theme customization
- Support for Android

## License

This project is licensed under the MIT License - see the LICENSE file for details.