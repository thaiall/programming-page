// program id : 22
// java j0602 "c:\program files"
// Listing all file in Directory
import java.io.*;
public class j0602 {
  public static void main (String args[]) {
    File d = new File(args[0]);
    String n[] = d.list();
    for (int i = 0; i < n.length; i++) {
      File f = new File(args[0] + '/' + n[i]);
      System.out.println(i+" : "+n[i]+" Size="+f.length());
    }
    System.out.println("Directory: "+d.getPath());
  }
}
