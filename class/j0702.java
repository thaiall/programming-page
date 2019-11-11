// program id : 30
// 1. อ่านข้อมูลจาก data.txt เขียนลง data.htm 
// 2. นำข้อมูลที่ถูกแยกด้วย , เขียนลง table อย่างเป็นระเบียบ
// 3. DOS>explorer data.htm
// 4. ต.ย. <input type=radio onclick={alert("a");}>
import java.io.*;
import java.lang.*;
public class j0702 {
  public static void main (String args[]) throws IOException {
    int i = 1;
    String b;
    String[] fields;
    String patternStr = ",";
    FileReader fin = new FileReader("data.txt");
    BufferedReader bin = new BufferedReader (fin);
    FileOutputStream fout = new FileOutputStream("data.htm");
    BufferedOutputStream bout = new BufferedOutputStream(fout);
    PrintStream pout = new PrintStream(bout);
    pout.println("<body bgcolor=yellow><table border=1 width=100%>");
    while ((b =  bin.readLine()) != null) {
      fields = b.split(patternStr);
      pout.println("<tr>");
      pout.println("<td>"+i+"</td>");
      pout.println("<td>"+"ID = " + fields[0]+"</td>");
      pout.println("<td>"+"Name = " + fields[1]+"</td>");
      pout.println("<td>"+"Salary = " + fields[2]+"</td>");
      pout.println("<td>"+"Status = " + fields[3]+"</td>");
      pout.println("</tr>");
      i = i + 1;
    }
    pout.println("</table></body>");
    fin.close();
    pout.close();
  }
}
