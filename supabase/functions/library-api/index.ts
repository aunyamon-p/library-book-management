import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SQL Server Configuration
const dbConfig = {
  user: Deno.env.get('DB_USERNAME') || 'libraryAdmin',
  password: Deno.env.get('DB_PASSWORD') || 'BookManage1234',
  server: Deno.env.get('DB_HOST') || 'localhost',
  port: parseInt(Deno.env.get('DB_PORT') || '1433'),
  database: Deno.env.get('DB_NAME') || 'library_book',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Helper function to execute SQL queries
async function executeQuery(query: string, params: any[] = []): Promise<any[]> {
  try {
    // TODO: Implement actual SQL Server connection using mssql package
    // This is a placeholder structure
    console.log('Executing query:', query);
    console.log('Parameters:', params);
    
    // You will need to implement the actual connection here
    // Example:
    // const sql = await import('npm:mssql@11.0.1');
    // const pool = await sql.connect(dbConfig);
    // const result = await pool.request()
    //   .input('param1', sql.Int, params[0])
    //   .query(query);
    // return result.recordset;
    
    throw new Error('SQL Server connection not implemented. Please implement the executeQuery function.');
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace('/library-api/', '');
    const [resource, id] = path.split('/');
    const method = req.method;

    console.log(`API Request: ${method} /${resource}${id ? `/${id}` : ''}`);

    // Route handling
    switch (resource) {
      case 'categories':
        return await handleCategories(method, id, req);
      case 'books':
        return await handleBooks(method, id, req);
      case 'members':
        return await handleMembers(method, id, req);
      case 'admins':
        return await handleAdmins(method, id, req);
      case 'borrow-records':
        return await handleBorrowRecords(method, id, req);
      case 'detail-borrows':
        return await handleDetailBorrows(method, id, req);
      case 'returns':
        return await handleReturns(method, id, req);
      case 'detail-returns':
        return await handleDetailReturns(method, id, req);
      default:
        return new Response(
          JSON.stringify({ error: 'Resource not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Category handlers
async function handleCategories(method: string, id: string | undefined, req: Request) {
  switch (method) {
    case 'GET':
      if (id) {
        const result = await executeQuery(
          'SELECT * FROM Category WHERE category_id = @p1',
          [parseInt(id)]
        );
        return new Response(JSON.stringify(result[0] || null), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        const result = await executeQuery('SELECT * FROM Category ORDER BY category_id');
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    
    case 'POST':
      const createData = await req.json();
      const insertResult = await executeQuery(
        'INSERT INTO Category (category_name) OUTPUT INSERTED.* VALUES (@p1)',
        [createData.category_name]
      );
      return new Response(JSON.stringify(insertResult[0]), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'PUT':
      if (!id) throw new Error('ID required for update');
      const updateData = await req.json();
      const updateResult = await executeQuery(
        'UPDATE Category SET category_name = @p1 OUTPUT INSERTED.* WHERE category_id = @p2',
        [updateData.category_name, parseInt(id)]
      );
      return new Response(JSON.stringify(updateResult[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'DELETE':
      if (!id) throw new Error('ID required for delete');
      await executeQuery('DELETE FROM Category WHERE category_id = @p1', [parseInt(id)]);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    default:
      throw new Error('Method not allowed');
  }
}

// Book handlers
async function handleBooks(method: string, id: string | undefined, req: Request) {
  switch (method) {
    case 'GET':
      if (id) {
        const result = await executeQuery(
          'SELECT * FROM Book WHERE book_id = @p1',
          [parseInt(id)]
        );
        return new Response(JSON.stringify(result[0] || null), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        const result = await executeQuery('SELECT * FROM Book ORDER BY book_id');
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    
    case 'POST':
      const createData = await req.json();
      const insertResult = await executeQuery(
        `INSERT INTO Book (isbn, book_name, author, publisher, publish_year, shelf, amount, status, category_id) 
         OUTPUT INSERTED.* 
         VALUES (@p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9)`,
        [
          createData.isbn,
          createData.book_name,
          createData.author,
          createData.publisher,
          createData.publish_year,
          createData.shelf,
          createData.amount,
          createData.status,
          createData.category_id
        ]
      );
      return new Response(JSON.stringify(insertResult[0]), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'PUT':
      if (!id) throw new Error('ID required for update');
      const updateData = await req.json();
      const updateResult = await executeQuery(
        `UPDATE Book 
         SET isbn = @p1, book_name = @p2, author = @p3, publisher = @p4, 
             publish_year = @p5, shelf = @p6, amount = @p7, status = @p8, category_id = @p9
         OUTPUT INSERTED.*
         WHERE book_id = @p10`,
        [
          updateData.isbn,
          updateData.book_name,
          updateData.author,
          updateData.publisher,
          updateData.publish_year,
          updateData.shelf,
          updateData.amount,
          updateData.status,
          updateData.category_id,
          parseInt(id)
        ]
      );
      return new Response(JSON.stringify(updateResult[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'DELETE':
      if (!id) throw new Error('ID required for delete');
      await executeQuery('DELETE FROM Book WHERE book_id = @p1', [parseInt(id)]);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    default:
      throw new Error('Method not allowed');
  }
}

// Member handlers
async function handleMembers(method: string, id: string | undefined, req: Request) {
  switch (method) {
    case 'GET':
      if (id) {
        const result = await executeQuery(
          'SELECT * FROM Member WHERE user_id = @p1',
          [parseInt(id)]
        );
        return new Response(JSON.stringify(result[0] || null), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        const result = await executeQuery('SELECT * FROM Member ORDER BY user_id');
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    
    case 'POST':
      const createData = await req.json();
      const insertResult = await executeQuery(
        `INSERT INTO Member (name, first_name, last_name, email, phone, borrowlimit, date_registered, status) 
         OUTPUT INSERTED.* 
         VALUES (@p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8)`,
        [
          createData.name,
          createData.first_name,
          createData.last_name,
          createData.email,
          createData.phone,
          createData.borrowlimit,
          createData.date_registered,
          createData.status
        ]
      );
      return new Response(JSON.stringify(insertResult[0]), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'PUT':
      if (!id) throw new Error('ID required for update');
      const updateData = await req.json();
      const updateResult = await executeQuery(
        `UPDATE Member 
         SET name = @p1, first_name = @p2, last_name = @p3, email = @p4, 
             phone = @p5, borrowlimit = @p6, date_registered = @p7, status = @p8
         OUTPUT INSERTED.*
         WHERE user_id = @p9`,
        [
          updateData.name,
          updateData.first_name,
          updateData.last_name,
          updateData.email,
          updateData.phone,
          updateData.borrowlimit,
          updateData.date_registered,
          updateData.status,
          parseInt(id)
        ]
      );
      return new Response(JSON.stringify(updateResult[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'DELETE':
      if (!id) throw new Error('ID required for delete');
      await executeQuery('DELETE FROM Member WHERE user_id = @p1', [parseInt(id)]);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    default:
      throw new Error('Method not allowed');
  }
}

// Admin handlers
async function handleAdmins(method: string, id: string | undefined, req: Request) {
  switch (method) {
    case 'GET':
      if (id) {
        const result = await executeQuery(
          'SELECT * FROM Admin WHERE admin_id = @p1',
          [parseInt(id)]
        );
        return new Response(JSON.stringify(result[0] || null), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        const result = await executeQuery('SELECT * FROM Admin ORDER BY admin_id');
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    
    case 'POST':
      const createData = await req.json();
      const insertResult = await executeQuery(
        `INSERT INTO Admin (username, password, first_name, last_name, name) 
         OUTPUT INSERTED.* 
         VALUES (@p1, @p2, @p3, @p4, @p5)`,
        [
          createData.username,
          createData.password,
          createData.first_name,
          createData.last_name,
          createData.name
        ]
      );
      return new Response(JSON.stringify(insertResult[0]), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'PUT':
      if (!id) throw new Error('ID required for update');
      const updateData = await req.json();
      const updateResult = await executeQuery(
        `UPDATE Admin 
         SET username = @p1, password = @p2, first_name = @p3, last_name = @p4, name = @p5
         OUTPUT INSERTED.*
         WHERE admin_id = @p6`,
        [
          updateData.username,
          updateData.password,
          updateData.first_name,
          updateData.last_name,
          updateData.name,
          parseInt(id)
        ]
      );
      return new Response(JSON.stringify(updateResult[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'DELETE':
      if (!id) throw new Error('ID required for delete');
      await executeQuery('DELETE FROM Admin WHERE admin_id = @p1', [parseInt(id)]);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    default:
      throw new Error('Method not allowed');
  }
}

// BorrowRecord handlers
async function handleBorrowRecords(method: string, id: string | undefined, req: Request) {
  switch (method) {
    case 'GET':
      if (id) {
        const result = await executeQuery(
          'SELECT * FROM BorrowRecord WHERE borrow_id = @p1',
          [parseInt(id)]
        );
        return new Response(JSON.stringify(result[0] || null), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        const result = await executeQuery('SELECT * FROM BorrowRecord ORDER BY borrow_id');
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    
    case 'POST':
      const createData = await req.json();
      const insertResult = await executeQuery(
        `INSERT INTO BorrowRecord (user_id, borrow_date, amount, recorded_by) 
         OUTPUT INSERTED.* 
         VALUES (@p1, @p2, @p3, @p4)`,
        [
          createData.user_id,
          createData.borrow_date,
          createData.amount,
          createData.recorded_by
        ]
      );
      return new Response(JSON.stringify(insertResult[0]), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'PUT':
      if (!id) throw new Error('ID required for update');
      const updateData = await req.json();
      const updateResult = await executeQuery(
        `UPDATE BorrowRecord 
         SET user_id = @p1, borrow_date = @p2, amount = @p3, recorded_by = @p4
         OUTPUT INSERTED.*
         WHERE borrow_id = @p5`,
        [
          updateData.user_id,
          updateData.borrow_date,
          updateData.amount,
          updateData.recorded_by,
          parseInt(id)
        ]
      );
      return new Response(JSON.stringify(updateResult[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'DELETE':
      if (!id) throw new Error('ID required for delete');
      await executeQuery('DELETE FROM BorrowRecord WHERE borrow_id = @p1', [parseInt(id)]);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    default:
      throw new Error('Method not allowed');
  }
}

// DetailBorrow handlers
async function handleDetailBorrows(method: string, id: string | undefined, req: Request) {
  switch (method) {
    case 'GET':
      if (id) {
        const result = await executeQuery(
          'SELECT * FROM DetailBorrow WHERE detail_borrow_id = @p1',
          [parseInt(id)]
        );
        return new Response(JSON.stringify(result[0] || null), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        const result = await executeQuery('SELECT * FROM DetailBorrow ORDER BY detail_borrow_id');
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    
    case 'POST':
      const createData = await req.json();
      const insertResult = await executeQuery(
        `INSERT INTO DetailBorrow (borrow_id, book_id, due_date, renew_count, status) 
         OUTPUT INSERTED.* 
         VALUES (@p1, @p2, @p3, @p4, @p5)`,
        [
          createData.borrow_id,
          createData.book_id,
          createData.due_date,
          createData.renew_count,
          createData.status
        ]
      );
      return new Response(JSON.stringify(insertResult[0]), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'PUT':
      if (!id) throw new Error('ID required for update');
      const updateData = await req.json();
      const updateResult = await executeQuery(
        `UPDATE DetailBorrow 
         SET borrow_id = @p1, book_id = @p2, due_date = @p3, renew_count = @p4, status = @p5
         OUTPUT INSERTED.*
         WHERE detail_borrow_id = @p6`,
        [
          updateData.borrow_id,
          updateData.book_id,
          updateData.due_date,
          updateData.renew_count,
          updateData.status,
          parseInt(id)
        ]
      );
      return new Response(JSON.stringify(updateResult[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'DELETE':
      if (!id) throw new Error('ID required for delete');
      await executeQuery('DELETE FROM DetailBorrow WHERE detail_borrow_id = @p1', [parseInt(id)]);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    default:
      throw new Error('Method not allowed');
  }
}

// Returned handlers
async function handleReturns(method: string, id: string | undefined, req: Request) {
  switch (method) {
    case 'GET':
      if (id) {
        const result = await executeQuery(
          'SELECT * FROM Returned WHERE return_id = @p1',
          [parseInt(id)]
        );
        return new Response(JSON.stringify(result[0] || null), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        const result = await executeQuery('SELECT * FROM Returned ORDER BY return_id');
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    
    case 'POST':
      const createData = await req.json();
      const insertResult = await executeQuery(
        `INSERT INTO Returned (return_date, totalfine, processed_by) 
         OUTPUT INSERTED.* 
         VALUES (@p1, @p2, @p3)`,
        [
          createData.return_date,
          createData.totalfine,
          createData.processed_by
        ]
      );
      return new Response(JSON.stringify(insertResult[0]), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'PUT':
      if (!id) throw new Error('ID required for update');
      const updateData = await req.json();
      const updateResult = await executeQuery(
        `UPDATE Returned 
         SET return_date = @p1, totalfine = @p2, processed_by = @p3
         OUTPUT INSERTED.*
         WHERE return_id = @p4`,
        [
          updateData.return_date,
          updateData.totalfine,
          updateData.processed_by,
          parseInt(id)
        ]
      );
      return new Response(JSON.stringify(updateResult[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'DELETE':
      if (!id) throw new Error('ID required for delete');
      await executeQuery('DELETE FROM Returned WHERE return_id = @p1', [parseInt(id)]);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    default:
      throw new Error('Method not allowed');
  }
}

// DetailReturned handlers
async function handleDetailReturns(method: string, id: string | undefined, req: Request) {
  switch (method) {
    case 'GET':
      if (id) {
        const result = await executeQuery(
          'SELECT * FROM DetailReturned WHERE detail_returned_id = @p1',
          [parseInt(id)]
        );
        return new Response(JSON.stringify(result[0] || null), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } else {
        const result = await executeQuery('SELECT * FROM DetailReturned ORDER BY detail_returned_id');
        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    
    case 'POST':
      const createData = await req.json();
      const insertResult = await executeQuery(
        `INSERT INTO DetailReturned (return_id, book_id, fine, status) 
         OUTPUT INSERTED.* 
         VALUES (@p1, @p2, @p3, @p4)`,
        [
          createData.return_id,
          createData.book_id,
          createData.fine,
          createData.status
        ]
      );
      return new Response(JSON.stringify(insertResult[0]), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'PUT':
      if (!id) throw new Error('ID required for update');
      const updateData = await req.json();
      const updateResult = await executeQuery(
        `UPDATE DetailReturned 
         SET return_id = @p1, book_id = @p2, fine = @p3, status = @p4
         OUTPUT INSERTED.*
         WHERE detail_returned_id = @p5`,
        [
          updateData.return_id,
          updateData.book_id,
          updateData.fine,
          updateData.status,
          parseInt(id)
        ]
      );
      return new Response(JSON.stringify(updateResult[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    case 'DELETE':
      if (!id) throw new Error('ID required for delete');
      await executeQuery('DELETE FROM DetailReturned WHERE detail_returned_id = @p1', [parseInt(id)]);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    
    default:
      throw new Error('Method not allowed');
  }
}