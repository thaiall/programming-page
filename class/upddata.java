/* Update data in upddata.mdb by JAVA version 2.0 
updata.mdb [tdata: ta1 as number, ta2 as text, ta3 as text]
ODBC DSN = upddata (upddata.mdb in drive c)
Update : 18 Septermber 2546
Source code from Ms.Phimine Wongta [ IIT program ] */
import java.sql.*;
import java.awt.*;
import java.awt.event.*;
public class upddata implements ActionListener {
	Connection connection; 
	Statement statement;
	String sourceURL = "jdbc:odbc:upddata";
	boolean badd;
	Frame s 		= new Frame("Screen");
    // Justify Left=0, Middle=1, Right=2
	Label lhead		= new Label("โปรแกรมปรับปรุงข้อมูลใน MDB ด้วย JAVA",1);
	Label lf1		= new Label("field ta1",0);
	Label lf2		= new Label("field ta2",0);
	Label lf3		= new Label("field ta3",0);

	TextField tf1		= new TextField(10);
	TextField tf2		= new TextField(50);
	TextField tf3		= new TextField(50);

	Button binsert		= new Button("เพิ่ม");	
	Button bdel			= new Button("ลบ");
	Button bedit		= new Button("แก้ไข");
	Button bsearch 		= new Button("ค้นหา");
	Button bsave		= new Button("บันทึก");
	Button bclose		= new Button("Exit");
	Button bclear		= new Button("clear");   	

	int searchfound;

    // JComboBox cbnation;
	public static void main(String[] args) {
		upddata r = new upddata();
		r.init();
	}
	
	public upddata() {
		try	{
			Class.forName("sun.jdbc.odbc.JdbcOdbcDriver");
			connection = DriverManager.getConnection(sourceURL);
			statement = connection.createStatement();
		} catch (SQLException sqle) {
			System.err.println("Error creating connection");
		} catch (ClassNotFoundException cnfe) {
			System.err.println(cnfe.toString());
		}
	}

	public void closeConnection() {
		if(connection != null)
		try	{
			connection.close();
			connection = null;
		}
		catch (SQLException ex)	{
			System.err.println("\nSQLException:\n");
			System.err.println("SQLState: "+ex.getSQLState());
			System.err.println("Message: "+ ex.getMessage());
		}
	}
	
	void useBounds() {
		binsert.setBounds(500,100,100,30);
		bdel.setBounds(500,130,100,30);
		bedit.setBounds(500,160,100,30);
		bsearch.setBounds(500,190,100,30);
		bsave.setBounds(500,220,100,30);
		bclear.setBounds(500,250,100,30);
		bclose.setBounds(500,280,100,30);
		
		lf1.setBounds(50,100,100,30);tf1.setBounds(150,100,100,30);
		lf2.setBounds(50,140,100,30);tf2.setBounds(150,140,200,30);
		lf3.setBounds(50,180,100,30);tf3.setBounds(150,180,200,30); 	
	}
	
	public void init()	{	
		beginenable();
		s.setSize(700,500);				// Size Frame width,height
		s.setLocation(1,1);				// load Frame Center Monitor x,y
		s.setLayout(null);
		s.setVisible(true);
		s.setBackground(Color.yellow);
		bsetfirst();					//function setEnabled button
		useBounds();					//function setBounds
		
		lhead.setBounds(1,30,500,30);
		lhead.setFont(new Font("ms sans serif", Font.BOLD,26));
		lhead.setForeground(Color.red);
		s.add(lhead);
		
		s.setFont(new Font("ms sans serif", Font.BOLD,16));	//set ตัวอักษร
		s.setForeground(Color.black);				//set สีตัวอักษร
		s.add(lf1);s.add(tf1);
		s.add(lf2);s.add(tf2);
		s.add(lf3);s.add(tf3);
		
		s.setForeground(Color.blue);
		s.add(binsert) ;binsert.addActionListener(this);	
		s.add(bdel) ;bdel.addActionListener(this);			
		s.add(bedit) ;bedit.addActionListener(this);		
		s.add(bsearch);bsearch.addActionListener(this);		
		s.add(bsave);bsave.addActionListener(this);			
		s.add(bclear);bclear.addActionListener(this);		
		s.add(bclose);bclose.addActionListener(this);		
		s.show();//show frame s
	}

//ค้นหา	
	public void search() {		
		String sql = "select * from tdata where ta1 = "+tf1.getText();	
		try {
			ResultSet registerResults = statement.executeQuery(sql);
			searchfound = 0;
			while (registerResults.next()) {	
				tf1.setText(registerResults.getString("ta1"));
				tf2.setText(registerResults.getString("ta2"));
   				tf3.setText(registerResults.getString("ta3"));
				searchfound = 1;
			}					
			registerResults.close();
			if (searchfound == 0) {
				tf2.setText("not found");
   				tf3.setText("not found");			
			}
		} catch (SQLException sqle)	{
			System.err.println("\nSQLException:\n");
			System.err.println("SQLState: "+sqle.getSQLState());
			System.err.println("Message: "+ sqle.getMessage());
		}
	}

//เพิ่ม	
	public void insert() {		
		String sql="INSERT INTO tdata VALUES("+tf1.getText()+",'"+tf2.getText()
		 +"','"+tf3.getText()+"')";
		try {
			statement.execute(sql);
		} catch (SQLException sqle)	{
			System.err.println("\nSQLException:\n");
			System.err.println("SQLState: "+sqle.getSQLState());
			System.err.println("Message: "+ sqle.getMessage());			
		}
	}

//ลบ	
	public void delete() {
		String sql="DELETE * FROM tdata where ta1="+tf1.getText();	 
		try {
			statement.execute(sql);
		} catch (SQLException sqle)	{
			System.err.println("\nSQLException:\n");
			System.err.println("SQLState: "+sqle.getSQLState());
			System.err.println("Message: "+ sqle.getMessage());
		}
	}
	
//แก้ไข	
	public void edit() {	
        String sql="UPDATE tdata set ta2 = '"+tf2.getText()+"', ta3 = '"+tf3.getText()+"' where ta1="+tf1.getText();		 
		try {
			statement.execute(sql);
		} catch (SQLException sqle)	{
			System.err.println("\nSQLException:\n");
			System.err.println("SQLState: "+sqle.getSQLState());
			System.err.println("Message: "+ sqle.getMessage());
		}
	}

	void clear()	{
		tf1.setText(" ");
		tf2.setText(" ");
		tf3.setText(" ");	
		beginenable();
	}	
	void bsetfirst()	{
		binsert.setEnabled(true);
		bsearch.setEnabled(true);
		bdel.setEnabled(false);
		bedit.setEnabled(false);
		bsave.setEnabled(false);
		bclear.setEnabled(false);		
	}
	void ifsearch()	{
		bdel.setEnabled(true);
		bedit.setEnabled(true);
		bsave.setEnabled(true);
		bclear.setEnabled(true);
		bsave.setEnabled(false);
	}
	void ifDEI()	{
		binsert.setEnabled(true);
		bdel.setEnabled(true);
		bedit.setEnabled(true);
		bsave.setEnabled(true);
		bclear.setEnabled(true);
		bsearch.setEnabled(false);		
	}	
	void beginenable()	{
	    tf1.setEnabled(true);
		tf1.requestFocus();
		tf2.setEnabled(false);
		tf3.setEnabled(false);
		binsert.setEnabled(true);
		bdel.setEnabled(false);
		bedit.setEnabled(false);
		bsave.setEnabled(false);
		bclear.setEnabled(false);
		bsearch.setEnabled(true);		
	}	
	void Searchenable()	{
		binsert.setEnabled(true);
		bdel.setEnabled(true);
		bedit.setEnabled(true);
		bclear.setEnabled(true);
		bsearch.setEnabled(false);	
	}	
	void insertenable()	{
		tf1.setEnabled(true);
		tf2.setEnabled(true);
		tf3.setEnabled(true);
		tf1.requestFocus();		
	}	
	public void actionPerformed(ActionEvent a)	{			
			if(a.getSource()==binsert) {
				badd=true;
				insertenable();
				ifDEI();
			} else if(a.getSource()==bdel) {			  
			  ifDEI();
			  delete();	
			  clear();
			} else if(a.getSource()==bsearch) {
			  ifsearch();			  
			  beginenable();
			  search();
			  Searchenable();
			} else if (a.getSource()==bedit) {
				badd=false;
				insertenable();
				ifDEI();
				search();			
			} else if(a.getSource()==bclear) {
			  clear();
			} else if(a.getSource()==bsave) {			   			
			  if (badd==true)  {
			  	insert();
				clear();
			  } else {
			  	edit();
				clear();
			  }
			} else if (a.getSource()==bclose) {			
				System.exit(0);
				//	new menu().init();				
			}		
	}
}