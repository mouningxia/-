import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { apiKey, ...requestData } = body;

    // 验证API Key
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key is required' },
        { status: 400 }
      );
    }

    // 确保参数格式正确
    const formattedData = {
      ...requestData,
      max_tokens: parseInt(requestData.maxToken) || 512,
  kbIds: Array.isArray(requestData.kbIds) ? requestData.kbIds : (requestData.kbIds || '').split(',').filter(id => id.trim()),
  model: 'qanything-4o-mini',
    };

    console.log('Sending full request to YD API:', JSON.stringify(formattedData, null, 2));
        console.log('Authorization header:', `Bearer ${apiKey}`);

    // 代理请求到有道API
    const response = await fetch('https://openapi.youdao.com/q_anything/api/chat_stream', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorText = await response.text();
  let errorDetails;
  try {
    errorDetails = JSON.parse(errorText);
  } catch (e) {
    errorDetails = errorText;
  }
        console.error('YD API Response:', response.status, response.headers, errorText);
      console.error('YD API Raw Error:' , errorText);
      return NextResponse.json(
        { error: `API request failed: ${response.status} - ${JSON.stringify(errorDetails)}` },
        { status: response.status }
      );
    }

    // 返回Server-Sent Events流式响应
    const readable = new ReadableStream({
        start(controller) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        function pump() {
            return reader.read().then(({ done, value }) => {
                if (done) {
                controller.close();
                return;
                }
                
                // 解码并转发数据
                const chunk = decoder.decode(value, { stream: true });
                controller.enqueue(new TextEncoder().encode(chunk));
                return pump();
            }).catch(err => {
            console.error('Stream error:', err);
            controller.error(err);
        });
        }
        
        return pump();
    }
    });

    return new NextResponse(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}