// program id : 21
// try on c:/windows/win.ini 
import java.io.*;
public class j0601 {
  public static void main (String args[]) throws IOException {
    File f = new File("c:/windows/win.ini");
    System.out.println("getName: "+f.getName());
    System.out.println("getPath: "+f.getPath());
    System.out.println("getAbsolutePath: "+f.getAbsolutePath());
    System.out.println("exists: "+f.exists());
    System.out.println("isFile: "+f.isFile());
    System.out.println("isDirectory: "+f.isDirectory());
    System.out.println("canWrite: "+f.canWrite());
    System.out.println("canRead: "+f.canRead());
    System.out.println("length: "+f.length());
    // create hello1.txt have 0 byte
    File file = new File("hello1.txt");
    boolean success = file.createNewFile(); // 0 byte
    // move hello1.txt to hello2.txt
    File file2 = new File("hello2.txt");
    success = file.renameTo(file2);
    // move hello2.txt to c:/hello2.txt
    File b = new File("c:/");
    success = file2.renameTo(new File(b, file2.getName()));
    // if(!found) then can not delete & success = false
    success = (new File("hello2.txt")).delete();
    System.out.println("Delete hello2.txt : " + success); // false
    // if (found) then delete & success = true
    success = (new File("c:/hello2.txt")).delete();
    System.out.println("Delete c:/hello2.txt : " + success); // true
  }
}
