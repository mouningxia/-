export const metadata = {
  title: 'QAnything',
  description: 'Embedded QAnything AI tool',
};

export default function QAnythingPage() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 4rem)', margin: 0, padding: 0 }}>
      <iframe
        src="https://ai.youdao.com/saas/qanything"
        width="100%"
        height="100%"
        frameBorder="0"
        title="QAnything AI Tool"
        style={{ border: 'none' }}
      />
    </div>
  );
}