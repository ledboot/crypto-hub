# API 代理系统

## 概述

为了解决用户无法直接访问外部 API 的问题，我们实现了一个基于 Next.js API 路由的代理服务器系统。用户无需使用代理软件，即可通过我们的服务器获取 Binance 价格数据和 BSC Scan 区块链数据。

## 功能特性

- ✅ **无需用户代理**：用户无需配置任何代理软件
- ✅ **自动重试机制**：网络错误时自动重试
- ✅ **请求限流**：避免过于频繁的请求
- ✅ **缓存机制**：减少重复请求
- ✅ **批量查询**：支持一次查询多个代币价格
- ✅ **错误处理**：完善的错误处理和回退机制
- ✅ **CORS 支持**：支持跨域请求

## API 端点

### 1. Binance 单个价格查询

**端点：** `GET /api/binance-proxy`

**参数：**
- `symbol` (必需): 代币符号，如 `BTCUSDT`、`ETHUSDT`

**示例：**
```bash
GET /api/binance-proxy?symbol=BTCUSDT
```

**响应：**
```json
{
  "symbol": "BTCUSDT",
  "price": "43250.50"
}
```

### 2. Binance 批量价格查询

**端点：** `POST /api/binance-proxy/batch`

**请求体：**
```json
{
  "symbols": ["BTC", "ETH", "BNB", "ADA"]
}
```

**响应：**
```json
{
  "results": {
    "BTC": {
      "symbol": "BTCUSDT",
      "price": "43250.50"
    },
    "ETH": {
      "symbol": "ETHUSDT", 
      "price": "2650.30"
    }
  },
  "errors": ["ADA: HTTP 404"],
  "total": 4,
  "success": 3,
  "failed": 1
}
```

### 3. BSC Scan 区块链数据查询

**端点：** `GET /api/bscscan-proxy`

**参数：**
- `action` (必需): 查询类型，可选值：`txlist`（普通交易）、`txlistinternal`（内部交易）、`tokentx`（代币交易）
- `address` (必需): BSC 地址

**示例：**
```bash
GET /api/bscscan-proxy?action=txlist&address=0x8894e0a0c962cb723c1976a4421c95949be2d4e3
```

**响应：**
```json
{
  "status": "1",
  "message": "OK",
  "result": [
    {
      "blockNumber": "12345678",
      "timeStamp": "1640995200",
      "hash": "0x...",
      "from": "0x...",
      "to": "0x...",
      "value": "1000000000000000000",
      "gas": "21000",
      "gasPrice": "20000000000"
    }
  ]
}
```

## 使用方法

### 在代码中使用

```typescript
import BnApiUtils from '@/utils/bn-api'

// 获取单个代币价格
const price = await BnApiUtils.fetchTokenPrice('BTC')

// 批量获取代币价格
const prices = await BnApiUtils.fetchMultipleTokenPrices(['BTC', 'ETH', 'BNB'])
```

### 直接调用 API

```javascript
// Binance 单个查询
const response = await fetch('/api/binance-proxy?symbol=BTCUSDT')
const data = await response.json()

// Binance 批量查询
const response = await fetch('/api/binance-proxy/batch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    symbols: ['BTC', 'ETH', 'BNB']
  })
})
const data = await response.json()

// BSC Scan 查询
const response = await fetch('/api/bscscan-proxy?action=txlist&address=0x8894e0a0c962cb723c1976a4421c95949be2d4e3')
const data = await response.json()
```

## 测试页面

访问 `/api-test` 页面可以测试代理 API 的功能：

- 测试 Binance 单个价格查询
- 测试 Binance 批量价格查询
- 测试 BSC Scan 区块链数据查询
- 查看详细的响应数据
- 验证错误处理机制

## 技术实现

### 代理服务器特性

1. **请求头伪装**：使用真实的浏览器 User-Agent 和其他请求头
2. **超时控制**：设置合理的请求超时时间
3. **错误重试**：网络错误时自动重试
4. **请求限流**：批量请求时限制并发数量
5. **缓存机制**：客户端和服务器端双重缓存

### 安全考虑

- 输入验证：验证所有输入参数
- 请求限制：限制批量请求的大小
- 错误信息：不暴露敏感的错误信息
- CORS 配置：适当的跨域访问控制

### 性能优化

- 并发控制：避免同时发起过多请求
- 请求延迟：批次间添加适当延迟
- 缓存策略：减少重复请求
- 错误回退：代理失败时回退到直接请求

## 故障排除

### 常见问题

1. **API 返回 500 错误**
   - 检查网络连接
   - 查看服务器日志
   - 确认代币符号是否正确

2. **批量查询部分失败**
   - 检查失败的代币符号是否存在
   - 确认符号格式是否正确
   - 查看错误详情

3. **请求超时**
   - 检查网络连接
   - 减少批量查询的数量
   - 稍后重试

### 调试方法

1. 查看浏览器开发者工具的网络面板
2. 检查服务器控制台日志
3. 使用测试页面验证 API 功能
4. 检查环境变量配置

## 部署注意事项

1. **环境变量**：确保生产环境配置正确的 API 密钥
   - `NEXT_PUBLIC_BSC_SCAN_API_KEY` 或 `BSC_SCAN_API_KEY`：BSC Scan API 密钥
2. **网络访问**：确保服务器可以访问 Binance API 和 BSC Scan API
3. **监控告警**：设置 API 调用监控
4. **日志记录**：记录重要的 API 调用日志
5. **API 密钥安全**：API 密钥现在存储在服务器端，客户端无法访问

## 更新日志

- **v1.0.0**: 初始版本，支持 Binance 单个和批量价格查询
- **v1.1.0**: 添加 BSC Scan 代理支持，API 密钥移至服务器端
- 支持自动重试和错误回退
- 实现请求限流和缓存机制
- 增强安全性，API 密钥不再暴露给客户端 