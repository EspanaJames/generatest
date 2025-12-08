<?php
session_start();

if (!isset($_SESSION["username"])) {
    header("Location: ../../index.html");
    exit();
}

$username = $_SESSION["username"];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="James España" />
    <title>Company</title>
    <link
      rel="icon"
      type="image/x-icon"
      href="../../assets/images/user.png"
    />
    <link rel="stylesheet" href="../../assets/styles/dashboardStyles.css" />
    <link rel="stylesheet" href="../../assets/styles/homePanelStyles.css" />
    <link rel="stylesheet" href="../../assets/styles/settingsStyles.css" />
    <link rel="stylesheet" href="../../assets/styles/gradesStyles.css" />
    <link rel="stylesheet" href="../../assets/styles/testStyles.css" />
    <link rel="stylesheet" href="../../assets/styles/subjectPopupStyles.css"/> 
    <link rel="stylesheet" href="../../assets/styles/examPopupStyles.css" />
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
    
<section class="mainContainer">
    <nav class = "sideBar">
        <div class = "burgerButtonHolder">
            <span class="menuText">MENU</span>
            <div class="container" onclick="myFunction(this)">
            <div class="bar1"></div>
            <div class="bar2"></div>
            <div class="bar3"></div>
            </div>
        </div>
        <button class="navButton" data-page="Home">
            <img src="../../assets/images/home.png" alt="homeButton"> <span class="buttonText">Home</span>
        </button>
        <button class="navButton" data-page="generatest">
            <img src="../../assets/images/test.png" alt="generateButton"> <span class="buttonText">Tests</span>
        </button>
        <button class="navButton" data-page="Grades"> 
            <img src="../../assets/images/charts.png" alt="gradesButton"> <span class="buttonText">Grade</span>
        </button>
        <button class="navButton" data-page="Setting">
            <img src="../../assets/images/settings.png" alt="settingsButton"> <span class="buttonText">Config</span>
        </button>
        <button id="logoutButton">
            <img src="../../assets/images/logout.png" alt="logoutButton"> <span class="buttonText">Logout</span>
        </button>
    </nav>

    <header class = "titleHeader">
        <img src="../../assets/images/user.png" alt="company LOGO">
        <h2>Welcome, <?php echo htmlspecialchars($username); ?>!</h2>
    </header>

    <div id="parentId" class = "contentContainer">

    </div>
</section>
    <footer class = "footerDetails">

    </footer>
    <script>
        function myFunction(x) {
        x.classList.toggle("change");
        document.querySelector(".sideBar").classList.toggle("expanded");
    document.querySelector(".mainContainer").classList.toggle("sidebar-expanded");
    
    }
    </script>
    <script type = "module"src="../functions/dashboardLogout.js"></script>
    <script>
    const LOGGED_IN_USER = "<?php echo htmlspecialchars($username); ?>";
    </script>
    <script type="module" src="../components/nav/main.js"></script>
</body>
</html>
<!-- 2RZndesU -->