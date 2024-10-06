'use client';

import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  onMessage,
  isSupported,
  getToken,
} from 'firebase/messaging';
import Image from 'next/image';
import { firebaseConfig } from '../../firebase-config';
import { useEffect, useState } from 'react';

export default function Home() {
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
          alert(token);
          // 알림 권한 요청
          Notification.requestPermission()
            .then((permission) => {
              if (permission === 'granted') {
                console.log('Notification permission granted.');
                // FCM 토큰 요청 및 기타 로직 수행
                // 포그라운드 메시지 처리
                unsubscribe = onMessage(messaging, (payload) => {
                  console.log('포그라운드 메시지:', payload);
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
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <Image
          className='dark:invert'
          src='https://nextjs.org/icons/next.svg'
          alt='Next.js logo'
          width={180}
          height={38}
          priority
        />
        <ol className='list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]'>
          <li className='mb-2'>
            Get started by editing{' '}
            <code className='bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold'>
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className='flex gap-4 items-center flex-col sm:flex-row'>
          <a
            className='rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5'
            href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              className='dark:invert'
              src='https://nextjs.org/icons/vercel.svg'
              alt='Vercel logomark'
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className='rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44'
            href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            target='_blank'
            rel='noopener noreferrer'
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='https://nextjs.org/icons/file.svg'
            alt='File icon'
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='https://nextjs.org/icons/window.svg'
            alt='Window icon'
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image
            aria-hidden
            src='https://nextjs.org/icons/globe.svg'
            alt='Globe icon'
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
