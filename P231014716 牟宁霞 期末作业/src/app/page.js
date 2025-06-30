
'use client';

import React from 'react';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#fff5f5', fontFamily: 'Microsoft YaHei, sans-serif', color: '#8B5F7D', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#dea5c1' }}>★ 课程作品展示 ★</h1>

      <section className="dream-box" style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', padding: '60px' }}>
        <div style={{ flex: '1 1 250px', minHeight: '200px', padding: '20px', border: '2px dashed #f2abce', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.9)', transition: 'all 0.3s', position: 'relative' }}>
          <h2 style={{ textAlign: 'center' }}>作品1</h2>
        </div>
        <div style={{ flex: '1 1 250px', minHeight: '200px', padding: '20px', border: '2px dashed #f2abce', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.9)', transition: 'all 0.3s', position: 'relative' }}>
          <h2 style={{ textAlign: 'center' }}>作品2</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '30px', padding: '10px', backgroundColor: 'rgba(217, 217, 240, 0.3)', borderRadius: '15px', marginTop: '20px' }}>
            <p style={{ padding: '15px', border: '2px solid #E6E6FA', borderRadius: '50%', textAlign: 'center', backgroundColor: 'white' }}>1</p>
            <p style={{ padding: '15px', border: '2px solid #E6E6FA', borderRadius: '50%', textAlign: 'center', backgroundColor: 'white' }}>2</p>
            <p style={{ padding: '15px', border: '2px solid #E6E6FA', borderRadius: '50%', textAlign: 'center', backgroundColor: 'white' }}>3</p>
            <p style={{ padding: '15px', border: '2px solid #E6E6FA', borderRadius: '50%', textAlign: 'center', backgroundColor: 'white' }}>4</p>
          </div>
        </div>
      </section>

      <section className="dream-box" style={{ display: 'flex', flexWrap: 'wrap', gap: '60px', padding: '60px' }}>
        <div style={{ flex: '1 1 250px', minHeight: '200px', padding: '20px', border: '2px dashed #f2abce', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.9)', transition: 'all 0.3s', position: 'relative' }}>
          <h2 style={{ textAlign: 'center' }}>作品3</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', padding: '10px', backgroundColor: 'rgba(217, 217, 240, 0.3)', borderRadius: '15px', marginTop: '20px' }}>
            <p style={{ padding: '15px', border: '2px solid #E6E6FA', borderRadius: '200px', textAlign: 'center', backgroundColor: 'white' }}>A</p>
            <p style={{ padding: '15px', border: '2px solid #E6E6FA', borderRadius: '200px', textAlign: 'center', backgroundColor: 'white' }}>B</p>
          </div>
        </div>
        <div style={{ flex: '1 1 250px', minHeight: '200px', padding: '20px', border: '2px dashed #f2abce', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.9)', transition: 'all 0.3s', position: 'relative' }}>
          <h2 style={{ textAlign: 'center' }}>作品4</h2>
          <div style={{ width: '300px', height: '300px', backgroundColor: '#FFB6C1', borderRadius: '50%', margin: 'auto', transition: '0.3s' }}></div>
        </div>
      </section>

      <style jsx global>{`
        .dream-box > div:hover {
          transform: rotate(3deg);
          box-shadow: 0 5px 15px rgba(216, 154, 185, 0.2);
        }
      `}</style>
    </div>
  );
}
