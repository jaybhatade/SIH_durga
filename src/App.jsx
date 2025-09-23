import React, { useState, useEffect, useRef } from 'react';
import { Shield, MapPin, Phone, Users, AlertTriangle, Settings, Mic, Bell, Navigation, Heart, Battery, Wifi, Volume2, Eye, Timer, AlertCircle, CheckCircle, Activity, Lock, Share2 } from 'lucide-react';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('setup');
  const [userProfile, setUserProfile] = useState({
    name: '',
    phone: '',
    emergencyContacts: [{ name: '', phone: '', relation: 'Family' }],
    customTrigger: 'triple-tap',
    audioSensitivity: 'high'
  });
  
  const [appState, setAppState] = useState({
    isActive: false,
    isListening: false,
    locationTracking: false,
    gestureDetection: false,
    audioDetection: false
  });

  const [countdown, setCountdown] = useState(0);
  const [location, setLocation] = useState({ lat: 19.0760, lng: 72.8777, address: 'Mumbai, Maharashtra' });
  
  const [alerts, setAlerts] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [gesturePattern, setGesturePattern] = useState([]);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [lastActivity, setLastActivity] = useState(new Date());

  const audioRef = useRef(null);
  const countdownRef = useRef(null);

  // Simulate location updates
  useEffect(() => {
    if (appState.locationTracking) {
      const locationTimer = setInterval(() => {
        setLocation(prev => ({
          ...prev,
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001
        }));
        setLastActivity(new Date());
      }, 5000);

      return () => clearInterval(locationTimer);
    }
  }, [appState.locationTracking]);

 

  // Simulate audio detection
  useEffect(() => {
    if (appState.audioDetection) {
      const audioTimer = setInterval(() => {
        const level = Math.random() * 100;
        setAudioLevel(level);
        
        // Simulate distress sound detection
        if (level > 80 && Math.random() > 0.8) {
          triggerAlert('Distress sounds detected! Possible emergency situation.', 'danger', true);
        } else if (level > 60 && Math.random() > 0.95) {
          triggerAlert('Loud noise detected - monitoring for emergency.', 'warning');
        }
      }, 1000);

      return () => clearInterval(audioTimer);
    }
  }, [appState.audioDetection]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && countdownRef.current) {
      // Countdown finished - send alert
      sendEmergencyAlert();
    }
    
    return () => {
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, [countdown]);

  const triggerAlert = (message, type = 'info', autoSend = false) => {
    const newAlert = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
      location: location,
      autoSend
    };
    setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
    
    if (autoSend) {
      setCountdown(3); // 3 second countdown
    }
    
    // Auto-remove alert after 8 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
    }, 8000);
  };

  const sendEmergencyAlert = () => {
    triggerAlert('🚨 EMERGENCY ALERT SENT! Contacts notified, location shared.', 'danger');
    setAppState(prev => ({ ...prev, locationTracking: true }));
    
    // Simulate sending to emergency contacts
    userProfile.emergencyContacts.forEach(contact => {
      if (contact.phone) {
        console.log(`SMS sent to ${contact.name} (${contact.phone}): EMERGENCY! ${userProfile.name} needs help. Location: ${location.lat}, ${location.lng}`);
      }
    });
  };

  const handleGestureTrigger = () => {
    const newPattern = [...gesturePattern, Date.now()];
    setGesturePattern(newPattern);
    
    // Check for triple tap within 2 seconds
    if (newPattern.length >= 3) {
      const recentTaps = newPattern.filter(tap => Date.now() - tap < 2000);
      if (recentTaps.length >= 3) {
        triggerAlert('Gesture trigger activated! Starting emergency protocol.', 'danger', true);
        setGesturePattern([]);
        return;
      }
    }
    
    // Clear old patterns
    setTimeout(() => {
      setGesturePattern(prev => prev.filter(tap => Date.now() - tap < 2000));
    }, 2000);
  };

  const cancelCountdown = () => {
    setCountdown(0);
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
    }
    triggerAlert('Emergency alert cancelled by user.', 'info');
  };

  const addEmergencyContact = () => {
    setUserProfile(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '', relation: 'Friend' }]
    }));
  };

  const updateEmergencyContact = (index, field, value) => {
    setUserProfile(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const SetupScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Women Safety Analytics</h1>
          <p className="text-gray-600">Advanced Protection with AI Detection</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* User Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              User Setup
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" for="is">Full Name *</label>
                <input
                  type="text" id="is"
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                  placeholder="Enter your full name"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" for="it">Phone Number *</label>
                <input
                  type="number" id="it"
                  className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                  placeholder="+91 98765 43210"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-blue-600" />
              Emergency Contacts
            </h3>
            
            {userProfile.emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg mb-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    className="p-2 border border-blue-200 rounded-md text-sm"
                    value={contact.name}
                    onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                  />
                  <select
                    className="p-2 border border-blue-200 rounded-md text-sm"
                    value={contact.relation}
                    onChange={(e) => updateEmergencyContact(index, 'relation', e.target.value)}
                  >
                    <option>Family</option>
                    <option>Friend</option>
                    <option>Police</option>
                    <option>Volunteer</option>
                  </select>
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-2 border border-blue-200 rounded-md text-sm"
                  value={contact.phone}
                  onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                />
              </div>
            ))}
            
            <button
              onClick={addEmergencyContact}
              className="w-full p-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            >
              + Add Emergency Contact
            </button>
          </div>

          {/* Trigger Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Trigger Settings
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom Trigger</label>
                <select
                  className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50"
                  value={userProfile.customTrigger}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, customTrigger: e.target.value }))}
                >
                  <option value="triple-tap">Triple Tap Screen</option>
                  <option value="power-button">Power Button (5 times)</option>
                  <option value="voice-command">Voice Command</option>
                  <option value="shake">Shake Device</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Audio Detection Sensitivity</label>
                <select
                  className="w-full p-3 border border-blue-200 rounded-lg bg-blue-50"
                  value={userProfile.audioSensitivity}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, audioSensitivity: e.target.value }))}
                >
                  <option value="high">High (Quiet areas, low noise)</option>
                  <option value="medium">Medium (Normal environments)</option>
                  <option value="low">Low (Noisy public places)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Required Permissions
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Location Access
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Microphone Access
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                SMS/Notifications
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Bluetooth/WiFi
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Background App
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                Camera Access
              </div>
            </div>
          </div>

          <button
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
            onClick={() => {
              if (userProfile.name && userProfile.phone && userProfile.emergencyContacts[0].phone) {
                setAppState(prev => ({ 
                  ...prev, 
                  isActive: true, 
                  locationTracking: true,
                  audioDetection: true,
                  gestureDetection: true 
                }));
                setCurrentScreen('dashboard');
                triggerAlert('Safety protection activated successfully! All systems online.', 'success');
              } else {
                triggerAlert('Please fill in all required fields (Name, Phone, and at least one emergency contact).', 'warning');
              }
            }}
          >
            🛡️ Activate Safety Protection
          </button>
        </div>
      </div>
    </div>
  );

  const DashboardScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Safety Dashboard</h1>
            <p className="text-blue-100 text-sm">🟢 Protection Active</p>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center">
              <Battery className="w-4 h-4 mr-1" />
              {batteryLevel}%
            </div>
            <Wifi className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Countdown Alert */}
        {countdown > 0 && (
          <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">🚨 EMERGENCY ALERT</h3>
                <p className="text-sm">Sending in {countdown} seconds...</p>
              </div>
              <button
                onClick={cancelCountdown}
                className="bg-white text-red-500 px-4 py-2 rounded-lg font-semibold"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Alert Messages */}
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl shadow-sm ${
              alert.type === 'danger' ? 'bg-red-100 border-l-4 border-red-500' :
              alert.type === 'warning' ? 'bg-yellow-100 border-l-4 border-yellow-500' :
              alert.type === 'success' ? 'bg-green-100 border-l-4 border-green-500' :
              'bg-blue-100 border-l-4 border-blue-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <p className={`font-medium ${
                alert.type === 'danger' ? 'text-red-800' :
                alert.type === 'warning' ? 'text-yellow-800' :
                alert.type === 'success' ? 'text-green-800' :
                'text-blue-800'
              }`}>{alert.message}</p>
              <span className="text-xs text-gray-500">{alert.timestamp}</span>
            </div>
          </div>
        ))}

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Detection Status</p>
                <p className="font-bold text-blue-600">Active</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Nearby Help</p>
                <p className="font-bold text-green-600">{nearbyDevices.filter(d => d.hasApp).length} Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Button */}
        <div className="text-center py-6">
          <button
            className="w-48 h-48 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full font-bold text-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-2xl transform hover:scale-105"
            onClick={handleGestureTrigger}
          >
            🚨<br/>EMERGENCY<br/>
            <span className="text-sm">Tap 3 times quickly</span>
          </button>
          
          {gesturePattern.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Taps: {gesturePattern.length}/3
            </p>
          )}
        </div>

        {/* Audio Detection */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <Volume2 className="w-5 h-5 mr-2 text-blue-600" />
              Audio Detection
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              appState.audioDetection ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {appState.audioDetection ? 'Listening' : 'Paused'}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Audio Level</span>
              <span>{Math.round(audioLevel)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  audioLevel > 80 ? 'bg-red-500' : 
                  audioLevel > 60 ? 'bg-yellow-500' : 
                  'bg-blue-500'
                }`}
                style={{ width: `${audioLevel}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600">
              Sensitivity: {userProfile.audioSensitivity} | AI detection active
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
            onClick={() => triggerAlert('Current location shared with emergency contacts.', 'info')}
          >
            <Share2 className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="font-semibold text-gray-800">Share Location</p>
          </button>
          
          <button
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
            onClick={() => setAppState(prev => ({ ...prev, audioDetection: !prev.audioDetection }))}
          >
            <Mic className={`w-6 h-6 mx-auto mb-2 ${appState.audioDetection ? 'text-red-500' : 'text-gray-500'}`} />
            <p className="font-semibold text-gray-800">
              {appState.audioDetection ? 'Stop Listening' : 'Start Listening'}
            </p>
          </button>
        </div>

      

        {/* Location Status */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
            Location Status
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Address:</strong> {location.address}</p>
            <p><strong>Coordinates:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
            <p><strong>Last Update:</strong> {lastActivity.toLocaleTimeString()}</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-green-600 font-medium">GPS Active • Continuous Tracking</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 text-xs text-gray-500">
          <p>🛡️ Women Safety Analytics v2.0</p>
          <p>Background protection active • Battery optimized</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans">
      {currentScreen === 'setup' ? <SetupScreen /> : <DashboardScreen />}
    </div>
  );
};

export default App;
