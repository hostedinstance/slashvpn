'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { Button } from '@/components/Button';
import AuroraShader from '@/components/Aurora';

export default function RegisterPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика регистрации
    console.log('Registration email:', email);
  };

  return (
    <main className="relative min-h-screen bg-black">
      {/* Aurora в самом низу страницы */}
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none">
        <AuroraShader
          flipVertical={true}
          colorStops={["#3700FF", "#000", "#3700FF"]}
          amplitude={0.6}
          blend={0.5}
          speed={2}
        />
      </div>

      {/* Основной контент поверх фонов */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Регистрационная форма */}
        <div className="flex-1 flex items-center justify-center p-4 py-40">
          <motion.div
            className="w-full max-w-[500px] rounded-xl overflow-hidden border-[0.75px] border-white/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div
              className={cn(
                'size-full bg-repeat bg-[length:50px_50px]',
                'bg-square-pattern-light dark:bg-square-pattern'
              )}
            >
              <div className="size-full bg-gradient-to-b from-neutral-900 to-black">
                <div className="p-8 md:p-12">
                  {/* Заголовок */}
                  <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tighter">
                      Регистрация
                    </h1>
                    <p className="text-white/60 text-sm md:text-base">
                      Введите email для доступа к SlashVPN
                    </p>
                  </motion.div>

                  {/* Форма */}
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {/* Email */}
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white/80"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-[border-color,box-shadow] duration-200"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    {/* Кнопка */}
                    <div className="pt-2 flex justify-center">
                      <motion.div whileTap={{ scale: 0.98 }}>
                        <Button
                          href="#"
                          classname="w-fit text-base py-3 px-6"
                        >
                          Зарегистрироваться
                        </Button>
                      </motion.div>
                    </div>
                  </motion.form>

                  {/* Дополнительная информация */}
                  <motion.div
                    className="mt-6 text-center text-sm text-white/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    Уже есть аккаунт?{' '}
                    <a href="/login" className="text-white/80 hover:text-white underline transition-colors">
                      Войти
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <Footer />
      </div>
    </main>
  );
}