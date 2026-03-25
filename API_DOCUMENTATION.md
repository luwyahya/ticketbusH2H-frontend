# API Endpoints Documentation - Transaction Module

Dokumentasi ini menjelaskan endpoint API yang dibutuhkan untuk fitur transaksi mitra.

## Base URL
```
/api/v1/transactions
```

---

## 1. Statistics API

### Endpoint
```
GET /api/v1/transactions/statistics
```

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| period | string | Yes | `today`, `month`, atau `year` |
| month | integer | No | Bulan (1-12), required jika period = `month` |
| year | integer | No | Tahun (2023, 2024, dst), required jika period = `month` atau `year` |

### Request Examples

**Statistik Hari Ini:**
```
GET /api/v1/transactions/statistics?period=today
```

**Statistik Bulan Tertentu:**
```
GET /api/v1/transactions/statistics?period=month&month=1&year=2024
```

**Statistik Tahun Tertentu:**
```
GET /api/v1/transactions/statistics?period=year&year=2024
```

### Response Format
```json
{
  "success": true,
  "message": {
    "count": 12,
    "amount": 2400000
  }
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| count | integer | Jumlah transaksi |
| amount | integer | Total nominal transaksi |

---

## 2. History API

### Endpoint
```
GET /api/v1/transactions/history
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Halaman data |
| per_page | integer | No | 10 | Jumlah data per halaman |

### Request Example
```
GET /api/v1/transactions/history?page=1&per_page=5
```

### Response Format
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "trx_code": "NTZ2024011500123",
        "route": "Jakarta - Bandung",
        "amount": 200000,
        "status": "issued",
        "travel_date": "2024-01-20",
        "created_at": "2024-01-15 10:30:00"
      }
    ],
    "current_page": 1,
    "last_page": 5,
    "per_page": 5,
    "total": 25
  }
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| id | integer | ID transaksi |
| trx_code | string | Kode transaksi unik |
| route | string | Rute perjalanan (Origin - Destination) |
| amount | integer | Total pembayaran |
| status | string | Status: `booked`, `paid`, `issued`, `cancelled` |
| travel_date | string | Tanggal keberangkatan (YYYY-MM-DD) |
| created_at | string | Waktu transaksi dibuat |

---

## 3. Print Ticket API

### Endpoint
```
GET /api/v1/transactions/{trx_code}/print
```

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| trx_code | string | Yes | Kode transaksi |

### Request Example
```
GET /api/v1/transactions/NTZ2024011500123/print
```

### Response Format
```json
{
  "success": true,
  "message": {
    "trx_code": "NTZ2024011500123",
    "origin": "Jakarta",
    "origin_terminal": "Terminal Kampung Rambutan",
    "destination": "Bandung",
    "destination_terminal": "Terminal Leuwi Panjang",
    "travel_date": "2024-01-20",
    "departure_time": "08:00 WIB",
    "class": "Executive",
    "seat_numbers": "A1, A2",
    "passengers": [
      {
        "name": "John Doe",
        "identity_number": "3201234567890123"
      },
      {
        "name": "Jane Smith",
        "identity_number": "3201234567890124"
      }
    ],
    "customer_name": "John Doe",
    "customer_phone": "081234567890",
    "customer_email": "john.doe@example.com",
    "amount": 400000,
    "status": "issued",
    "agent_name": "Mitra Travel ABC"
  }
}
```

### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| trx_code | string | Kode transaksi |
| origin | string | Kota asal |
| origin_terminal | string | Terminal asal |
| destination | string | Kota tujuan |
| destination_terminal | string | Terminal tujuan |
| travel_date | string | Tanggal keberangkatan (YYYY-MM-DD) |
| departure_time | string | Jam keberangkatan |
| class | string | Kelas bus (Economy, Executive, dll) |
| seat_numbers | string | Nomor kursi (comma separated) |
| passengers | array | Array data penumpang |
| passengers[].name | string | Nama penumpang |
| passengers[].identity_number | string | NIK penumpang |
| customer_name | string | Nama pemesan |
| customer_phone | string | No. telepon pemesan |
| customer_email | string | Email pemesan (optional) |
| amount | integer | Total pembayaran |
| status | string | Status transaksi |
| agent_name | string | Nama mitra/agen |

---

## Notes untuk Backend Developer

### 1. Authentication
Semua endpoint ini memerlukan authentication token (Bearer token) dari user yang login sebagai mitra.

### 2. Authorization
- User hanya bisa melihat statistik dan histori transaksi mereka sendiri
- Filter berdasarkan `mitra_id` dari user yang login

### 3. Statistics Logic
- **Today**: Transaksi dengan `created_at` = hari ini
- **Month**: Transaksi dengan `created_at` dalam bulan & tahun tertentu
- **Year**: Transaksi dengan `created_at` dalam tahun tertentu
- Hanya hitung transaksi dengan status `issued` (transaksi yang sudah selesai)

### 4. History Logic
- Urutkan berdasarkan `created_at` DESC (terbaru dulu)
- Include semua status transaksi
- Pagination dengan Laravel: `paginate($per_page)`

### 5. Print Ticket Logic
- Ambil data lengkap transaksi dari database
- Join dengan tabel: schedules, routes, vehicles, passengers
- Format seat_numbers menjadi string comma separated
- Hanya bisa print jika status = `issued`

### 6. Error Handling
```json
{
  "success": false,
  "message": "Error message here"
}
```

### 7. Status Codes
- 200: Success
- 401: Unauthorized
- 403: Forbidden (bukan transaksi user)
- 404: Transaction not found
- 500: Server error

---

## Implementation Example (Laravel)

### Statistics Controller
```php
public function statistics(Request $request)
{
    $period = $request->period; // today, month, year
    $month = $request->month;
    $year = $request->year ?? date('Y');
    
    $query = Transaction::where('mitra_id', auth()->id())
                        ->where('status', 'issued');
    
    if ($period === 'today') {
        $query->whereDate('created_at', today());
    } elseif ($period === 'month') {
        $query->whereMonth('created_at', $month)
              ->whereYear('created_at', $year);
    } elseif ($period === 'year') {
        $query->whereYear('created_at', $year);
    }
    
    $count = $query->count();
    $amount = $query->sum('amount');
    
    return response()->json([
        'success' => true,
        'message' => [
            'count' => $count,
            'amount' => $amount
        ]
    ]);
}
```

### History Controller
```php
public function history(Request $request)
{
    $perPage = $request->per_page ?? 10;
    
    $transactions = Transaction::where('mitra_id', auth()->id())
                               ->with(['schedule.route'])
                               ->orderBy('created_at', 'desc')
                               ->paginate($perPage);
    
    $data = $transactions->map(function($trx) {
        return [
            'id' => $trx->id,
            'trx_code' => $trx->trx_code,
            'route' => $trx->schedule->route->origin . ' - ' . $trx->schedule->route->destination,
            'amount' => $trx->amount,
            'status' => $trx->status,
            'travel_date' => $trx->travel_date,
            'created_at' => $trx->created_at
        ];
    });
    
    return response()->json([
        'success' => true,
        'data' => [
            'data' => $data,
            'current_page' => $transactions->currentPage(),
            'last_page' => $transactions->lastPage(),
            'per_page' => $transactions->perPage(),
            'total' => $transactions->total()
        ]
    ]);
}
```

### Print Ticket Controller
```php
public function print($trxCode)
{
    $transaction = Transaction::where('trx_code', $trxCode)
                              ->where('mitra_id', auth()->id())
                              ->with(['schedule.route', 'schedule.vehicle', 'passengers'])
                              ->firstOrFail();
    
    if ($transaction->status !== 'issued') {
        return response()->json([
            'success' => false,
            'message' => 'Tiket belum bisa dicetak'
        ], 400);
    }
    
    $seatNumbers = $transaction->seats->pluck('seat_number')->join(', ');
    
    return response()->json([
        'success' => true,
        'message' => [
            'trx_code' => $transaction->trx_code,
            'origin' => $transaction->schedule->route->origin,
            'origin_terminal' => $transaction->schedule->route->origin_terminal,
            'destination' => $transaction->schedule->route->destination,
            'destination_terminal' => $transaction->schedule->route->destination_terminal,
            'travel_date' => $transaction->travel_date,
            'departure_time' => $transaction->schedule->departure_time,
            'class' => $transaction->schedule->vehicle->class,
            'seat_numbers' => $seatNumbers,
            'passengers' => $transaction->passengers,
            'customer_name' => $transaction->customer_name,
            'customer_phone' => $transaction->customer_phone,
            'customer_email' => $transaction->customer_email,
            'amount' => $transaction->amount,
            'status' => $transaction->status,
            'agent_name' => auth()->user()->name
        ]
    ]);
}
```

---

## Testing dengan Postman

### 1. Statistics
```
GET {{base_url}}/transactions/statistics?period=today
Authorization: Bearer {{token}}
```

### 2. History
```
GET {{base_url}}/transactions/history?page=1&per_page=5
Authorization: Bearer {{token}}
```

### 3. Print Ticket
```
GET {{base_url}}/transactions/NTZ2024011500123/print
Authorization: Bearer {{token}}
```
