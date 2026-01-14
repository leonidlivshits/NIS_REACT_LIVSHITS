import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

const MessageNotification: React.FC = () => {
  const [messageCount, setMessageCount] = useState<number>(0);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const randomCount = Math.floor(Math.random() * 10) + 1;
    setMessageCount(randomCount);
  }, []);

  const formatLastMessageDate = (): string => {
    const now = new Date();
    const locale = i18n.language === 'ru' ? ru : enUS;
    const dateFormat = t('dateFormats.short');
    
    return format(now, dateFormat, { locale });
  };

  const getMessageText = (): string => {
    const language = i18n.language;
    
    if (language === 'ru') {
      if (messageCount === 1) {
        return t('messages.one', { count: messageCount });
      } else if (messageCount >= 2 && messageCount <= 4) {
        return t('messages.few', { count: messageCount });
      } else {
        return t('messages.many', { count: messageCount });
      }
    } else {
      return messageCount === 1 
        ? t('messages.one', { count: messageCount })
        : t('messages.other', { count: messageCount });
    }
  };

  const handleChangeLanguage = (lang: 'ru' | 'en'): void => {
    i18n.changeLanguage(lang);
  };

  const handleRefresh = (): void => {
    const randomCount = Math.floor(Math.random() * 10) + 1;
    setMessageCount(randomCount);
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '500px',
      margin: '20px auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ marginTop: 0 }}>
        {i18n.language === 'ru' ? 'Уведомление о сообщениях' : 'Message Notification'}
      </h3>
      
      <div style={{
        fontSize: '18px',
        fontWeight: 'bold',
        margin: '15px 0',
        color: '#333'
      }}>
        {getMessageText()}
      </div>
      
      <div style={{
        color: '#666',
        fontSize: '14px',
        marginBottom: '15px'
      }}>
        ({t('messages.lastMessage')} {formatLastMessageDate()})
      </div>
      
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handleRefresh}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {i18n.language === 'ru' ? 'Новое число' : 'New Number'}
        </button>
        
        <button
          onClick={() => handleChangeLanguage('ru')}
          style={{
            padding: '8px 16px',
            backgroundColor: i18n.language === 'ru' ? '#2196F3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Русский
        </button>
        
        <button
          onClick={() => handleChangeLanguage('en')}
          style={{
            padding: '8px 16px',
            backgroundColor: i18n.language === 'en' ? '#2196F3' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          English
        </button>
      </div>
      
      <div style={{
        padding: '10px',
        backgroundColor: '#eee',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#666'
      }}>
        <div><strong>Debug Info:</strong></div>
        <div>Current language: {i18n.language}</div>
        <div>Message count: {messageCount}</div>
        <div>Date format from JSON: "{t('dateFormats.short')}"</div>
        <div>Today label: {t('dateFormats.today')}</div>
      </div>
    </div>
  );
};

export default MessageNotification;