'use client';

import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  onMessage,
  isSupported,
  getToken,
} from 'firebase/messaging';
import copy from 'copy-to-clipboard';
import { firebaseConfig } from '../../firebase-config';
import { useEffect, useState } from 'react';

export default function Home() {
  const [token, setToken] = useState('');
  const [data, setData] = useState('');

  // Firebase 앱 초기화
  const app = initializeApp(firebaseConfig);

  // 상태 관리로 지원 여부 저장
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    isSupported()
      .then((result) => {
        if (result) {
          setSupported(true); // FCM이 지원되는 브라우저일 때만 설정
        } else {
          console.log('This browser does not support FCM.');
        }
      })
      .catch((error) => {
        console.error('Error checking FCM support:', error);
      });
  }, []);

  useEffect(() => {
    if (supported) {
      let unsubscribe = () => {};
      const messaging = getMessaging(app);
      console.log('use effect');
      getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      })
        .then((token) => {
          console.log(token);

          setToken(token);

          // 알림 권한 요청
          Notification.requestPermission()
            .then((permission) => {
              if (permission === 'granted') {
                console.log('Notification permission granted.');
                // FCM 토큰 요청 및 기타 로직 수행
                // 포그라운드 메시지 처리
                unsubscribe = onMessage(messaging, (payload) => {
                  console.log('포그라운드 메시지:', payload);
                  setData(JSON.stringify(payload.data));
                  // 메시지를 처리하거나 UI에 알림 표시 로직
                });
              } else {
                console.log('Unable to get permission to notify.');
              }
            })
            .catch(() => {
              console.log('알림 권한 요청 실패');
            });
        })
        .catch((e) => {
          console.log('토큰 가져올 수 없음', e);
        });

      return () => {
        console.log('리턴??');
        unsubscribe();
      };
    }
  }, [supported]);

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <button
        onClick={() => {
          copy(token);
        }}
      >
        {token}
      </button>
      {data && <div>알람 내용: {data}</div>}
    </div>
  );
}
