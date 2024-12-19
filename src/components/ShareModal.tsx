import React, { useState } from 'react';
import { X, Copy, Share2, QrCode, Mail, MessageCircle } from 'lucide-react';
import { Event, ShareMethod } from '../types/Event';
import QRCode from 'qrcode.react';
import { clsx } from 'clsx';

interface ShareModalProps {
  event: Event;
  onClose: () => void;
}

export function ShareModal({ event, onClose }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link');
  const [copied, setCopied] = useState(false);

  const handleShare = async (method: ShareMethod) => {
    const shareText = `Join my event "${event.title}" on EasyPlan!\n${event.shareLink}`;

    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Join my event on EasyPlan&body=${encodeURIComponent(shareText)}`);
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(shareText)}`);
        break;
      case 'copy':
        await navigator.clipboard.writeText(event.shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
      case 'qr':
        setActiveTab('qr');
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800/90 backdrop-blur border border-white/10 rounded-xl w-full max-w-md shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Share Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('link')}
              className={clsx(
                'flex-1 py-2 rounded-lg font-medium transition-all duration-200',
                activeTab === 'link'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              Share Link
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={clsx(
                'flex-1 py-2 rounded-lg font-medium transition-all duration-200',
                activeTab === 'qr'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              QR Code
            </button>
          </div>

          {activeTab === 'link' ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={event.shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none"
                />
                <button
                  onClick={() => handleShare('copy')}
                  className={clsx(
                    'p-2 rounded-lg transition-all duration-200',
                    copied
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-gray-900/50 border border-white/10 text-gray-400 hover:text-white'
                  )}
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center p-4 bg-gray-900/50 border border-white/10 rounded-lg hover:border-green-500/30 hover:text-green-300 transition-all duration-200"
                >
                  <Share2 className="h-6 w-6 mb-2" />
                  <span className="text-sm">WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="flex flex-col items-center p-4 bg-gray-900/50 border border-white/10 rounded-lg hover:border-blue-500/30 hover:text-blue-300 transition-all duration-200"
                >
                  <Mail className="h-6 w-6 mb-2" />
                  <span className="text-sm">Email</span>
                </button>
                <button
                  onClick={() => handleShare('sms')}
                  className="flex flex-col items-center p-4 bg-gray-900/50 border border-white/10 rounded-lg hover:border-purple-500/30 hover:text-purple-300 transition-all duration-200"
                >
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <span className="text-sm">SMS</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-lg">
                <QRCode
                  value={event.shareLink}
                  size={200}
                  level="H"
                  includeMargin
                  renderAs="svg"
                />
              </div>
              <p className="mt-4 text-sm text-gray-400 text-center">
                Scan this QR code to join the event
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}