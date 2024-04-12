const experiments = [
    { title: 'ls command', code: 
   `
    #include<stdio.h>
    #include<dirent.h>    //handle directory
    #include<sys/stat.h>  //file info
    #include<pwd.h>       //user info
    #include<grp.h>       
    #include<time.h>
    
    int main() {
    DIR *d;              //directory
    struct dirent *de;   //directory entry
    struct stat buf;     //file info
    int i,j;
    char P[10]="rwxrwxrwx",AP[10]=" ";
    struct passwd *p;
    struct group *g;
    struct tm *t;
    char time[26];
    d=opendir(".");
    readdir(d);
    readdir(d);
    while( (de=readdir(d))!=NULL) //read all entries until end of directory
    {
    stat(de->d_name,&buf);
    // File Type
    if(S_ISDIR(buf.st_mode))
    printf("d");
    else if(S_ISREG(buf.st_mode))
    printf("-");
    else if(S_ISCHR(buf.st_mode))
    printf("c");
    else if(S_ISBLK(buf.st_mode))
    printf("b");
    else if(S_ISLNK(buf.st_mode))
    printf("l");
    else if(S_ISFIFO(buf.st_mode))
    printf("p");
    else if(S_ISSOCK(buf.st_mode))
    printf("s");
    
    //File Permissions P-Full Permissions AP-Actual Permissions
    for(i=0,j=(1<<8);i<9;i++,j>>=1)
    AP[i]= (buf.st_mode & j ) ? P[i] : '-' ;
    printf("%s",AP);
    
    //No. of Hard Links
    printf("%5d",buf.st_nlink);
    
    //User Name
    p=getpwuid(buf.st_uid);
    printf(" %.8s",p->pw_name);
    
    //Group Name
    g=getgrgid(buf.st_gid);
    printf(" %-8.8s",g->gr_name);
    
    //File Size
    printf(" %8d",buf.st_size);
    
    //Date and Time of modification
    t=localtime(&buf.st_mtime);
    strftime(time,sizeof(time),"%b %d %H:%M",t);
    printf(" %s",time);
    
    //File Name
    printf(" %s\\n",de->d_name);
    }
    
    }` },
    { title: 'cp command', code: `#include <stdio.h>
    #include <stdlib.h>
    #include <fcntl.h> //file control
    #include <errno.h>
    #include <sys/types.h> 
    #include <unistd.h> //file operations
    
    #define BUF_SIZE 8192
    int main(int argc, char* argv[]) {
    int input_fd, output_fd; //Input and output file descriptors
    ssize_t ret_in, ret_out; // Number of bytes returned by read() and write() 
    char buffer[BUF_SIZE]; //Character buffer 
    
    // Are src and dest file name arguments missing 
    if(argc != 3){
    printf ("Usage: cp file1 file2");
    return 1;
    }
    
    // Create input file descriptor 
    input_fd = open (argv [1], O_RDONLY);  //opens in read-only mode
    if (input_fd == -1) {
    perror ("open");
    return 2;
    }
    // Create output file descriptor 
    output_fd = open(argv[2], O_WRONLY | O_CREAT, 0644); //opens in write mode, if no file, then creates it
    if(output_fd == -1){
      perror("open");
      return 3;
    }
    
    // Copy process
    while((ret_in = read (input_fd, &buffer, BUF_SIZE)) > 0){
    ret_out = write (output_fd, &buffer, (ssize_t) ret_in);
    if(ret_out != ret_in){
       /* Write error */
       perror("write");
       return 4;
    }
    
    }
    // Close file descriptors 
    close (input_fd);
    close (output_fd);
    return (EXIT_SUCCESS);
    }` , imageUrl: "path_to_image_2.jpg"},
    { title: 'mv command', code: `#include <stdio.h>
    #include <stdlib.h>
    #include <fcntl.h> //file control
    #include <errno.h>
    #include <sys/types.h> 
    #include <unistd.h> //file operations
    
    int main(int argc, char* argv[]) {
    int input_fd, output_fd; // Input and output file descriptors
    
    // Are src and dest file name arguments missing 
    if(argc != 3){
    printf ("Usage: mv file1 file2");
    return 1;
    }
    // Create input file descriptor 
    input_fd = link(argv [1], argv[2]); //creates hard link between source and destination
    if (input_fd == -1) {
    perror ("link error");
    return 2;
    }
    // Create output file descriptor 
    output_fd = unlink(argv[1]);  //remove source file
    if(output_fd == -1){
    perror("unlink");
    return 3;
    }
    
    }`},
    { title: 'rm command', code: `#include <stdio.h>
    #include <stdlib.h>
    #include <fcntl.h> //file control
    #include <errno.h>
    #include <sys/types.h> 
    #include <unistd.h> //file operations
    
    int main(int argc, char* argv[]) { 
    int output_fd = unlink(argv[1]);  //unlink to delete the file
      if(output_fd == -1){
      perror("unlink error");
      return 3;
    }
    }`},
    { title: 'Process Control System Calls', code: `#include<stdio.h>
    #include<string.h>
    #include<sys/types.h>
    #include<stdlib.h>
    #include<unistd.h> //access to POSIX API- ex: getpid(),getppid(),fork()
    #include<wait.h>
    
    int main(int argc, char *argv[]){
    printf("Main Function: \\n");
    int retval=1;
    pid_t pid=fork();
    
    if(pid<0){
    printf("Error in fork operation\\n");
    }
    
    if(pid==0){
    printf("PID for Child process: %d \\nPID of its parent process: %d\\n",getpid(),getppid());
    execl("./binsearch",argv[1],NULL); //object file of child process program-binsearch.c
    }
    
    else{
    printf("PID of parent process: %d\\n",getpid());
    wait(&retval); //wait for child process to terminate
    
    if(WIFEXITED(retval)==1) //child process exit status
    {
    printf("Child terminated normally\\n");
    }
    else{
    printf("Child terminated abnormally\\n");
    exit(0);
    }
    
    }
    return 0;
    }
    
    //Binary search program 'binsearch.c' in a separate file
    #include<stdio.h>

    int binarySearch(int arr[], int l, int r, int x)
    {
    if (r >= l) {
    int mid = l + (r - l) / 2;
    if (arr[mid] == x)
    return 1;
    if (arr[mid] > x)
    return binarySearch(arr, l, mid - 1, x);
    return binarySearch(arr, mid + 1, r, x);
    }
    return -1;
    }
    
    void swap(int *xp, int *yp) {
    int temp = *xp;
    *xp = *yp;
    *yp = temp;
    }
    
    void sort(int arr[], int n) {
    int i, j;
    for (i = 0; i < n-1; i++)
    for (j = 0; j < n-i-1; j++)
    if (arr[j] > arr[j+1])
    swap(&arr[j], &arr[j+1]);
    }
    
    int main(){
    int n,key, arr[10];
    printf("Enter the number of elements in the array: ");
    scanf("%d",&n);
    printf("Enter the elements: ");
    for(int i=0;i<n;i++)
    scanf("%d",&arr[i]);
    
    sort(arr,n);
    printf("Enter element to be searched: ");
    scanf("%d",&key);
    int result = binarySearch(arr, 0, n - 1, key);
    if(result==-1)
    printf("Element is not present in array");
    else
    printf("Element is present");
    return 0;
    } `, imageUrl: "path_to_image_2.jpg"},
    { title: 'Thread management using Pthreads', code: `#include<stdio.h>
    #include<pthread.h> //handle pthread operations
    #include<sys/types.h>
    #include<stdlib.h>
    #include<unistd.h>
    #include<math.h>
    
    int a[4][4],b[4][4];
    
    //thread calling function
    void *matrixeval (void *val){
        int *thno = (int*)val;
        for(int i=0;i<4;i++)
          b[(*thno)][i]=a[(*thno)][i];
    
        for(int i=0;i<4;i++){
         for(int j=0;j<(*thno);j++)
          b[(*thno)][i]=b[(*thno)][i]*a[(*thno)][i]; 
          //b matrix stores elements of a matrix raised to power of row number
        }
        printf("(%d)thread \\n",(*thno+1)); //thread no. for each operation
    }
    
    int main(){
        pthread_t tid[4];
        for(int i=0;i<4;i++){
            printf("Enter elements of row %d: ",i+1);
            for(int j=0;j<4;j++)
              scanf("%d",&a[i][j]);
        }
        printf("Before processing: \\n");
        for(int i=0; i<4;i++){
            for(int j=0;j<4;j++)
              printf("%d ",a[i][j]);
            printf("\\n");
        }
        //Create threads for corresponding row operation
        for(int i=0;i<4;i++){
            pthread_create(&tid[i], NULL, matrixeval, (void*)&i); 
            sleep(1); //delay in thread creation
        }
        //calling thread waits for threads to terminate
        for(int i=0;i<4;i++){
            pthread_join(tid[i], NULL);
            sleep(1);
        }
        printf("After processing: \\n");
        for(int i=0; i<4;i++){
            for(int j=0;j<4;j++)
              printf("%d ",b[i][j]);
            printf("\\n");
        }
        pthread_exit(NULL); //terminates calling thread
        return 0;
    }`, imageUrl: "https://github.com/ManojithBhat/OSLabweb/blob/main/images/Threadmanagement.png"},
    { title: 'Dining philosophers problem', code: `#include <pthread.h>
    #include <semaphore.h>
    #include <stdio.h>
    #define N 5  //number of philosophers
    #define THINKING 2  //defining states of philosophers
    #define HUNGRY 1
    #define EATING 0
    #define LEFT (phnum + 4) % N 
    #define RIGHT (phnum + 1) % N
    
    int state[N];
    int phil[N] = { 0, 1, 2, 3, 4 }; //ID of philosophers
    sem_t mutex, S[N]; //sempahores to control synchronisation
    
    //check if neighbours are eating
    void test(int phnum){ 
    if (state[phnum] == HUNGRY && state[LEFT] != EATING && state[RIGHT] != EATING) {
    state[phnum] = EATING; //change state to eating
    sleep(2);
    printf("Philosopher %d takes fork %d and %d\\n",phnum + 1, LEFT + 1, phnum + 1);
    printf("Philosopher %d is Eating\\n", phnum + 1);
    sem_post(&S[phnum]);// used to wake up hungry philosophers during putfork
    }
    } 
    
    // take up chopsticks
    void take_fork(int phnum){
    sem_wait(&mutex);//only one philosopher can change state at a time
    state[phnum] = HUNGRY;// change state to hungry
    printf("Philosopher %d is Hungry\\n", phnum + 1);
    //eat if neighbours are not eating
    test(phnum);
    sem_post(&mutex);
    sem_wait(&S[phnum]);//if unable to eat wait to be signalled
    sleep(1);
    }
    
    // put down chopsticks
    void put_fork(int phnum){
    sem_wait(&mutex);
    state[phnum] = THINKING;//change state to thinking
    printf("Philosopher %d putting fork %d and %d down\\n", phnum + 1, LEFT + 1, phnum + 1);
    printf("Philosopher %d is thinking\\n", phnum + 1);
    //if neigbours can start eating
    test(LEFT); 
    test(RIGHT);
    sem_post(&mutex);//
    }
    
    //thread calling function
    void* philospher(void* num){
    while (1) {
    int* i = num;
    sleep(1);//time spent thinking before eating again
    take_fork(*i);//decide to eat again
    sleep(0);
    put_fork(*i);//finish eating
    }
    }
    
    int main(){
    int i;
    pthread_t thread_id[N];
    // initialize the semaphores
    sem_init(&mutex, 0, 1);
    for (i = 0; i < N; i++)
     sem_init(&S[i], 0, 0);
    
    for (i = 0; i < N; i++) {
    // create philosopher process threads
     pthread_create(&thread_id[i], NULL, philospher, &phil[i]);
     printf("Philosopher %d is thinking\\n", i + 1);
    }
    for (i = 0; i < N; i++)
     pthread_join(thread_id[i], NULL);
    
    }`, imageUrl: "images/Diningph.png"},
    { title: 'Producer-Consumer problem', code: `#include<stdio.h>
    #include<semaphore.h>
    #include<pthread.h>
    #include<stdlib.h>
    #define buffersize 10
    
    pthread_mutex_t mutex;
    pthread_t tidP[20],tidC[20];//producers,consumers
    sem_t full,empty;//semaphores to control full/empty state in buffer
    int counter;//track no. of items in buffer
    int buffer[buffersize];
    
    //Initialize semaphores and mutex variables
    void initialize(){
    pthread_mutex_init(&mutex,NULL);
    sem_init(&full,1,0);
    sem_init(&empty,1,buffersize);
    counter=0;
    }
     
    void write(int item){
      buffer[counter++]=item;
    }
    int read(){
      return(buffer[--counter]);
    }
    //Producer process
    void * producer (void * param){
    int waittime,item,i;
    item=rand()%5;
    waittime=rand()%5;
    sem_wait(&empty); //if buffer is full, producer waits, by decrementing empty
    pthread_mutex_lock(&mutex); //mutual exclusion to write to buffer
    printf("\\nProducer has produced item: %d\\n",item);
    write(item);
    pthread_mutex_unlock(&mutex); //unlock mutex
    sem_post(&full); //increments full, indicating new item added to buffer
    }
    
    //Consumer process
    void *consumer (void * param){
    int waittime,item;
    waittime=rand()%5;
    sem_wait(&full);//if buffer is empty, consumer waits
    pthread_mutex_lock(&mutex); //mutual exclusion to write to buffer
    item=read();
    printf("\\nConsumer has consumed item: %d\\n",item);
    pthread_mutex_unlock(&mutex); //unlock mutex
    sem_post(&empty);//increments empty, indicating buffer is no longer full
    }
    
    int main(){
    int n1,n2,i;
    initialize();
    printf("\\nEnter the no of producers: ");
    scanf("%d",&n1);
    printf("\\nEnter the no of consumers: ");
    scanf("%d",&n2);
    for(i=0;i<n1;i++)
      pthread_create(&tidP[i],NULL,producer,NULL);
    for(i=0;i<n2;i++)
      pthread_create(&tidC[i],NULL,consumer,NULL);
    
    for(i=0;i<n1;i++)
      pthread_join(tidP[i],NULL);
    for(i=0;i<n2;i++)
      pthread_join(tidC[i],NULL);
    
    exit(0);
    }`, imageUrl: "images/Producersconsumers.png"},
    { title: 'Reader-Writer problem', code: `#include<stdio.h>
    #include<stdlib.h>
    #include<pthread.h>
    #include<semaphore.h> //semaphore operations
    
    int count=0,rcount=0; // page no., no. of readers
    sem_t mutex,wr; 
    
    void* writer(void *p){
    int* i =(int*)p;
    sem_wait(&wr);//blocks writer access to 'count', until acquire 'wr'
    printf("\\nWriter %d writes page number %d",*i,++count);
    sem_post(&wr); //release of 'wr' semaphore to allow other writer threads
    }
    
    void* reader(void* p){
    int* i =(int*)p;
    sem_wait(&mutex);//mutual exclusion to allow only reader to modify 'rcount' at a time
    rcount++;
    if(rcount==1)
      sem_wait(&wr);//blocks writer access to 'count', until acquire 'wr'
    
    sem_post(&mutex);//release of 'mutex' semaphore to allow other reader threads
    printf("\\nReader %d reads page number %d ",*i,count);
    sem_wait(&mutex);//mutual exclusion to allow only reader to modify 'rcount' at a time
    rcount--;
    
    if(rcount==0)
      sem_post(&wr);//release of 'wr' semaphore to allow  writer threads
    
    sem_post(&mutex);//release of 'wr' semaphore to allow other reader threads
    }
    
    int main(){
    //Initialize semaphores
    sem_init(&mutex,0,1); 
    sem_init(&wr,0,1); 
    int a[6]={1,2,3,1,2,3};
    pthread_t p[6];
    
    for(int i=0;i<3;i++) pthread_create(&p[i],NULL,writer,&a[i]); //writer threads
    for(int i=3;i<6;i++) pthread_create(&p[i],NULL,reader,&a[i]); //reader threads
    for(int i=0;i<6;i++) pthread_join(p[i],NULL);
    
    }`, imageUrl: "images/Readerswriters.png"},
    { title: 'Process/thread synchronisation using File locks', code: `#include <stdio.h>
    #include <stdlib.h>
    #include <unistd.h>
    #include <fcntl.h> //file control
    #include <errno.h>
    
    int main(int argc,char *argv[]){
    int fd; //file descriptor to perform operations on file
    char buffer[255];
    struct flock fvar; //file lock structure
    //if src file not specified
    if(argc==1)
     {
       printf("usage: %s filename\\n",argv[0]);
       return -1;
     }
    if((fd=open(argv[1],O_RDWR))==-1)
     {
      perror("open");
      exit(1);
    }
    
    fvar.l_type=F_WRLCK; //type- write lock
    fvar.l_whence=SEEK_END; //relative offset- end of file
    fvar.l_start=SEEK_END-100; //starting offset
    fvar.l_len=100; //lock length
    
    printf("press enter to set lock\\n");
    getchar();
    printf("trying to get lock..\\n");
    
    if((fcntl(fd,F_SETLK,&fvar))==-1)
    { 
        fcntl(fd,F_GETLK,&fvar);
        printf("\\nFile already locked by process (pid): %d\\n",fvar.l_pid);
        return -1;
    }
    printf("locked\\n");
    
    if((lseek(fd,SEEK_END-50,SEEK_END))==-1){
      perror("lseek");
      exit(1);
    }
    if((read(fd,buffer,100))==-1)
    {
      perror("read");
      exit(1);
    }
    
    printf("data read from file..\\n");
    puts(buffer);
    printf("press enter to release lock\\n");
    getchar();
    
    fvar.l_type = F_UNLCK; //unlock file
    fvar.l_whence = SEEK_SET; //reset to beginning of file
    fvar.l_start = 0;
    fvar.l_len = 0;
    
    if((fcntl(fd,F_UNLCK,&fvar))==-1)
    {
    perror("fcntl");
    exit(0);
    }
    
    printf("Unlocked\\n");
    close(fd);
    return 0;
    }`, imageUrl: "path_to_image_2.jpg"},
    { title: 'Creation and use of Static and Shared libraries', code: `
    /* add.c */
    int add(int quant1, int quant2)
    {
      return(quant1 + quant2);
    }

    /* sub.c */
    int sub(int quant1, int quant2)
    {
      return(quant1 - quant2);
    }

    /* math1.h -library file that contains function declarations */
    int add(int, int); //adds two integers
    int sub(int, int); //subtracts second integer from first
    
    /* opDemo.c */
    #include <math1.h>
    #include <stdio.h>
 
    int main()
    {
     int x,y;
     printf("Enter values for x and y: ");
     scanf("%d %d",&x,&y);
     printf("%d + %d = %d \\n", x, y, add(x, y));
     printf("%d - %d = %d \\n", x, y, sub(x, y));
     return 0;
    }
    
    /* Static Linking */
    gcc -c add.c  //create object files
    gcc -c sub.c
    ar rs libmath1.a add.o sub.o  //link object files to library file (prefix- lib) (extension- .a for static)
    gcc -o opDemo opDemo.o libmath1.a

    /* Dynamic Linking */
    gcc -Wall -fPIC -c add.c
    gcc -Wall -fPIC -c sub.c
    gcc -shared -o libmath1.so add.o sub.o //link object files to library file (prefix- lib) (extension- .so for shared)
    gcc -o opDemo opDemo.o libmath1.so

    `, imageUrl: "path_to_image_2.jpg"},
    // Add more experiments here...
  ];


  export default experiments