# Cookie Consent Implementation

This project includes a GDPR-compliant cookie consent system for EU users.

## Features

- **GDPR Compliant**: Defaults to denied consent, requires explicit user action
- **Granular Control**: Users can choose specific cookie categories
- **Persistent Settings**: Preferences are saved for 1 year
- **Google Analytics Integration**: Automatically enables/disables based on consent
- **Accessible**: Keyboard navigation and screen reader friendly
- **Mobile Responsive**: Works on all device sizes

## Components

### CookieConsent
- Main banner that appears at the bottom of the page
- Shows on first visit until user gives consent
- Options: Accept All, Reject All, Customize

### CookieSettings
- Modal dialog for detailed cookie preferences
- Accessible via footer link "Cookie Settings"
- Allows granular control over cookie categories

### useCookieConsent Hook
- Manages cookie consent state
- Handles preference persistence
- Integrates with Google Analytics

## Cookie Categories

### Necessary (Always Active)
- Essential for website functionality
- Cannot be disabled
- Includes session management, security

### Analytics (Optional)
- Google Analytics tracking
- Anonymous usage statistics
- Performance monitoring

### Marketing (Optional)
- Advertising and marketing cookies
- Cross-site tracking
- Personalized content

## Implementation Details

### Google Analytics Integration
- Defaults to denied consent for GDPR compliance
- Uses `gtag('consent', 'update')` to enable/disable tracking
- IP anonymization enabled

### Cookie Storage
- Uses `js-cookie` library for reliable cookie management
- 1-year expiration for consent preferences
- SameSite=strict for security

### State Management
- React hooks for state management
- LocalStorage fallback for preferences
- Automatic consent checking on page load

## Usage

### For Users
1. **First Visit**: Cookie banner appears at bottom
2. **Choose Option**: Accept All, Reject All, or Customize
3. **Manage Later**: Click "Cookie Settings" in footer
4. **Update Preferences**: Change settings anytime

### For Developers
```typescript
import { useCookieConsent } from './hooks/useCookieConsent';

const MyComponent = () => {
  const { preferences, hasConsented } = useCookieConsent();
  
  // Check if analytics is allowed
  if (preferences.analytics) {
    // Enable analytics features
  }
};
```

## Testing

### Reset Consent
```javascript
// In browser console
localStorage.clear();
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
```

### Check Current Settings
```javascript
// In browser console
console.log(document.cookie);
```

## Compliance

- **GDPR Article 7**: Valid consent requirements
- **GDPR Article 13**: Information requirements
- **GDPR Article 25**: Privacy by design
- **ePrivacy Directive**: Cookie consent requirements

## Files

- `src/components/CookieConsent.tsx` - Main banner component
- `src/components/CookieSettings.tsx` - Settings modal
- `src/hooks/useCookieConsent.ts` - State management hook
- `src/utils/cookieUtils.ts` - Utility functions
- `index.html` - Google Analytics with consent mode

## Customization

### Styling
- Uses Tailwind CSS classes
- Matches site design system
- Responsive breakpoints included

### Text Content
- Update text in component files
- Link to privacy policy
- Localize for different languages

### Cookie Categories
- Add new categories in `CookiePreferences` interface
- Update components to handle new options
- Modify Google Analytics integration as needed 