package com.cricketuniverse.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CricketUniverseApp()
        }
    }
}

enum class Screen {
    HOME, WTC, DREAM_TEAM, CAREER, MANAGER, DATABASE
}

data class Player(
    val id: String,
    val name: String,
    val role: String,
    val country: String,
    val rating: Int,
    val category: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CricketUniverseApp() {
    var currentScreen by remember { mutableStateOf(Screen.HOME) }
    var selectedPlayingXI by remember { mutableStateOf(setOf<String>()) }
    var captainId by remember { mutableStateOf<String?>(null) }
    var wicketkeeperId by remember { mutableStateOf<String?>(null) }

    val darkBg = Color(0xFF020617)
    val cardBg = Color(0xFF0B1329)
    val goldAccent = Color(0xFFF59E0B)
    val emeraldAccent = Color(0xFF10B981)

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = Color(0xFF050B18),
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = currentScreen == Screen.HOME,
                    onClick = { currentScreen = Screen.HOME },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
                    label = { Text("Home", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = currentScreen == Screen.WTC,
                    onClick = { currentScreen = Screen.WTC },
                    icon = { Icon(Icons.Default.EmojiEvents, contentDescription = "WTC") },
                    label = { Text("WTC", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = currentScreen == Screen.DREAM_TEAM,
                    onClick = { currentScreen = Screen.DREAM_TEAM },
                    icon = { Icon(Icons.Default.Groups, contentDescription = "Dream XI") },
                    label = { Text("Dream XI", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = currentScreen == Screen.CAREER,
                    onClick = { currentScreen = Screen.CAREER },
                    icon = { Icon(Icons.Default.Person, contentDescription = "Career") },
                    label = { Text("Career", fontSize = 10.sp) }
                )
                NavigationBarItem(
                    selected = currentScreen == Screen.MANAGER,
                    onClick = { currentScreen = Screen.MANAGER },
                    icon = { Icon(Icons.Default.BusinessCenter, contentDescription = "Manager") },
                    label = { Text("Manager", fontSize = 10.sp) }
                )
            }
        },
        containerColor = darkBg
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFF0F172A),
                            darkBg
                        )
                    )
                )
        ) {
            when (currentScreen) {
                Screen.HOME -> HomeScreenView(onNavigate = { currentScreen = it })
                Screen.WTC -> WTCScreenView(
                    selectedPlayingXI = selectedPlayingXI,
                    captainId = captainId,
                    wicketkeeperId = wicketkeeperId,
                    onTogglePlayer = { id ->
                        selectedPlayingXI = if (selectedPlayingXI.contains(id)) {
                            selectedPlayingXI - id
                        } else {
                            if (selectedPlayingXI.size < 11) selectedPlayingXI + id else selectedPlayingXI
                        }
                    },
                    onSetCaptain = { captainId = it },
                    onSetWicketkeeper = { wicketkeeperId = it }
                )
                Screen.DREAM_TEAM -> DreamTeamScreenView()
                Screen.CAREER -> CareerScreenView()
                Screen.MANAGER -> ManagerScreenView()
                Screen.DATABASE -> DatabaseScreenView()
            }
        }
    }
}

@Composable
fun HomeScreenView(onNavigate: (Screen) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "CRICKET UNIVERSE",
            fontSize = 26.sp,
            fontWeight = FontWeight.Black,
            color = Color.White
        )
        Text(
            text = "Realistic Test & T20 Physics Simulation Engine",
            fontSize = 12.sp,
            color = Color.LightGray
        )

        Button(
            onClick = { onNavigate(Screen.WTC) },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF59E0B)),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(Icons.Default.EmojiEvents, contentDescription = null, tint = Color.Black)
            Spacer(modifier = Modifier.width(8.dp))
            Text("World Test Championship 2025-27", color = Color.Black, fontWeight = FontWeight.Bold)
        }

        Button(
            onClick = { onNavigate(Screen.DREAM_TEAM) },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF06B6D4)),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(Icons.Default.Groups, contentDescription = null, tint = Color.Black)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Dream Team Franchise Builder", color = Color.Black, fontWeight = FontWeight.Bold)
        }

        Button(
            onClick = { onNavigate(Screen.CAREER) },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF10B981)),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(Icons.Default.Person, contentDescription = null, tint = Color.Black)
            Spacer(modifier = Modifier.width(8.dp))
            Text("My Career Mode", color = Color.Black, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun WTCScreenView(
    selectedPlayingXI: Set<String>,
    captainId: String?,
    wicketkeeperId: String?,
    onTogglePlayer: (String) -> Unit,
    onSetCaptain: (String) -> Unit,
    onSetWicketkeeper: (String) -> Unit
) {
    val sampleSquad = remember {
        listOf(
            Player("IND_01", "Rohit Sharma", "Opening Batter", "IND", 92, "Icon"),
            Player("IND_02", "Yashasvi Jaiswal", "Opening Batter", "IND", 89, "Elite"),
            Player("IND_03", "Shubman Gill", "Top-Order Batter", "IND", 90, "Elite"),
            Player("IND_04", "Virat Kohli", "Top-Order Batter", "IND", 96, "Icon"),
            Player("IND_05", "Rishabh Pant", "Wicketkeeper-Batter", "IND", 93, "Icon"),
            Player("IND_06", "Ravindra Jadeja", "All-Rounder", "IND", 94, "Icon"),
            Player("IND_07", "Ravichandran Ashwin", "All-Rounder", "IND", 95, "Icon"),
            Player("IND_08", "Jasprit Bumrah", "Fast Bowler", "IND", 98, "Icon"),
            Player("IND_09", "Mohammed Shami", "Fast Bowler", "IND", 93, "Icon"),
            Player("IND_10", "Mohammed Siraj", "Fast Bowler", "IND", 88, "Elite"),
            Player("IND_11", "Kuldeep Yadav", "Bowler", "IND", 89, "Elite"),
            Player("IND_12", "KL Rahul", "Batter", "IND", 88, "Elite")
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "WTC Squad & Playing XI",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Surface(
                color = if (selectedPlayingXI.size == 11) Color(0xFF10B981) else Color(0xFFF59E0B),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(
                    text = "${selectedPlayingXI.size} / 11 Selected",
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(sampleSquad) { player ->
                val isSelected = selectedPlayingXI.contains(player.id)
                val isCaptain = captainId == player.id
                val isWk = wicketkeeperId == player.id

                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = if (isSelected) Color(0xFF064E3B) else Color(0xFF0F172A)
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(player.name, fontWeight = FontWeight.Bold, color = Color.White)
                                if (isCaptain) {
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(" (C)", color = Color(0xFFF59E0B), fontWeight = FontWeight.Black)
                                }
                                if (isWk) {
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(" (WK)", color = Color(0xFF38BDF8), fontWeight = FontWeight.Black)
                                }
                            }
                            Text("${player.role} • Rating ${player.rating}", fontSize = 12.sp, color = Color.Gray)
                        }

                        Button(
                            onClick = { onTogglePlayer(player.id) },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isSelected) Color(0xFFEF4444) else Color(0xFF10B981)
                            ),
                            shape = RoundedCornerShape(8.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(if (isSelected) "Remove" else "+ Select", fontSize = 11.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable fun DreamTeamScreenView() { Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text("Dream Team Mode", color = Color.White) } }
@Composable fun CareerScreenView() { Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text("Career Mode", color = Color.White) } }
@Composable fun ManagerScreenView() { Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text("Manager Mode", color = Color.White) } }
@Composable fun DatabaseScreenView() { Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { Text("Player Database", color = Color.White) } }
