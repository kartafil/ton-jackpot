// src/components/FAQSection.tsx

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'Как работает сервис?',
    answer: 'Контракт лотереи собирает ставки, пока их сумма не достигнет заданной создателем.\nЕсли ставки набираются, то определяется победитель, который получает NFT, а создатель лотереи - ставки.\nВ случае истечения дедлайна лотереи происходит возврат ставок и NFT.\nВся логика реализована на смарт-контрактах, что гарантирует надежность и прозрачность розыгрыша'
  },
  {
    question: 'Как я могу участвовать?',
    answer: 'Для участия в лотерее необходимо сделать ставку не ниже минимальной. Ставку можно сделать как через сайт, так и отправив на адрес контракта сумму ставки и сообщение "bet"(маленькими буквами, без кавычек).\nСтавка засчитывается в случае успешной транзакции, иначе контракт лотереи вам ее вернет'
  },
  {
    question: 'Как узнать адрес контракта лотереи?',
    answer: 'Вы можете узнать адрес лотереи на сайте. Она появится в общем списке лотерей после создания, и вы будете указаны ее создателем'
  },
  {
    question: 'Как создать лотерею?',
    answer: 'Для создания своей лотереи воспользуйтесь формой на сайте.\nПервым шагом необходимо создать сам контракт лотереи: для этого укажите необходимые параметры и подтвердите транзакцию.\nДалее вам необходимо узнать адрес контракта созданной лотереи и NFT, которую вы хотите разыграть.\nБудьте внимательны при вводе адресов!'
  },
  {
    question: 'Сколько стоят услуги сервиса?',
    answer: 'Сервис получает 10% от суммы розыгрыша, после вычета из нее всех комиссий. Комиссии связаны с работой смарт-контрактов и могут меняться в зависимости от количества участников розыгрыша'
  }
];

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-section mt-8">
      <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqItems.map((item, index) => (
          <div key={index} className="faq-item mb-2">
            <button
              className="faq-question text-left w-full bg-gray-200 p-3 rounded-lg focus:outline-none"
              onClick={() => handleToggle(index)}
            >
              {item.question}
            </button>
            {activeIndex === index && (
              <div className="faq-answer bg-white p-3 mt-1 rounded-lg border border-gray-300">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
