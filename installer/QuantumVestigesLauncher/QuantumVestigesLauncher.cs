using System.Linq;
using System.Security.Policy;

namespace QuantumVestigesInstaller {
    class Game {
        public string ZipFileName { get; set; } = "";
        public string GameName { get; set; } = "";
        public string GameVersion { get; set; } = "";
        public string BackgroundImagePath { get; set; } = "";
        public string InternalId { get; set; } = "";
        public string ProductId { get; set; } = "";
    }
    class CognitoDetails {
        public string Region { get; set; } = "";
        public string UserPoolId { get; set; } = "";
        public string ClientId { get; set; } = "";
        public string CognitoDomain { get; set; } = "";
        public string RedirectUri { get; set; } = "";
    }
    class BaseConfig {
        public string Env { get; set; } = "";
        public string DownloadFolder { get; set; } = "";
        public string BackendUrl { get; set; } = "";
        public string FrontendUrl { get; set; } = "";
        public Game[] Games { get; set; } = System.Array.Empty<Game>();
        public CognitoDetails Cognito { get; set; } = new CognitoDetails();
    }
    class PurchasedItem {
        public string username { get; set; } = "";
        public int productId { get; set; } = 0;
        public string productName { get; set; } = "";
        public string productType { get; set; } = "";
        public string franchiseId { get; set; } = "";
        public string franchiseName { get; set; } = "";
    }
    class User {
        public string AccessToken { get; set; } = "";
        public string Username { get; set; } = "";
        public PurchasedItem[] PurchasedItems { get; set; } = System.Array.Empty<PurchasedItem>();
    }
public partial class QuantumVestigesWindow : System.Windows.Window {
        [System.STAThread]
        public static void Main() {
            System.Windows.Application app = new System.Windows.Application();
            QuantumVestigesWindow windowInstaller = new QuantumVestigesWindow();
            windowInstaller.Show();

            app.Run(windowInstaller);
        }
        private const string ResourceFolder = "assets";
        private System.Windows.Controls.TextBlock TxtTitle = null!;
        private System.Windows.Controls.TextBlock TxtStatus = null!;
        private System.Windows.Controls.Button BtnAction = null!;
        private System.Windows.Controls.Button LogButton = null!;
        private System.Windows.Controls.Grid mainGrid = null!;
        private System.Windows.Controls.ProgressBar ProgBar = null!;
        private System.Windows.Controls.TextBlock TxtPercentage = null!;
        private System.Windows.Controls.Image BackgroundImage = null!;
        private System.Windows.Controls.StackPanel NavBarStackPanelLeft = null!;
        private System.Windows.Controls.StackPanel NavBarStackPanelRight = null!;
        private Game SelectedGame = new Game();
        private User UserObject = null!;
        private BaseConfig _config = new BaseConfig();
        // Directory setup
        private string CompanyName = "Quantum Vestiges";
        private string ApplicationData = System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData);
        private string ApplicationSetupDir;
        private int NavigationWidth = 150;
        private int ContentWidth = 1408;
        private string codeVerifier = "";

        public QuantumVestigesWindow () {
            Title = CompanyName;
            Height = 768 + 40;
            Width = 3 * NavigationWidth + ContentWidth + 15;
            WindowStartupLocation = System.Windows.WindowStartupLocation.CenterScreen;
            Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x12, 0x12, 0x12));
            ApplicationSetupDir = System.IO.Path.Combine(ApplicationData, CompanyName);
            SetupConfig();
            BuildManualLayout();
        }
        private void BuildManualLayout() {
            // Core layout grid
            mainGrid = new System.Windows.Controls.Grid { };
            mainGrid.RowDefinitions.Add(new System.Windows.Controls.RowDefinition {
                Height = System.Windows.GridLength.Auto,
            });
            mainGrid.RowDefinitions.Add(new System.Windows.Controls.RowDefinition {
                Height = new System.Windows.GridLength(1, System.Windows.GridUnitType.Star),
            });
            mainGrid.RowDefinitions.Add(new System.Windows.Controls.RowDefinition {
                Height = System.Windows.GridLength.Auto,
            });
            // Setup left-side buttons
            {
                System.Windows.Controls.Border navBorderLeft = new System.Windows.Controls.Border {
                    Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x1A, 0x1A, 0x1A)),
                    BorderThickness = new System.Windows.Thickness(0, 0, 5, 0),
                    BorderBrush = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x2D, 0x2D, 0x2D)),
                    MaxWidth = NavigationWidth,
                    HorizontalAlignment = System.Windows.HorizontalAlignment.Left,
                };
                NavBarStackPanelLeft = new System.Windows.Controls.StackPanel {
                    Margin = new System.Windows.Thickness(0, 0, 0, 0),
                    MaxWidth = NavigationWidth,
                };
                System.Windows.Controls.Grid.SetColumn(navBorderLeft, 0);

                navBorderLeft.Child = NavBarStackPanelLeft;
                mainGrid.Children.Add(navBorderLeft);
            }
            // Setup main content grid
            {
                System.Windows.Controls.Grid contentGrid = new System.Windows.Controls.Grid {
                    HorizontalAlignment = System.Windows.HorizontalAlignment.Left,
                    Margin = new System.Windows.Thickness(NavigationWidth, 0, 0, 0),
                };
                // 1. Title and Status block
                System.Windows.Controls.StackPanel titlePanel = new System.Windows.Controls.StackPanel {
                    Margin = new System.Windows.Thickness(0, 0, 0, 60)
                };
                TxtTitle = new System.Windows.Controls.TextBlock {
                    Text = CompanyName,
                    FontSize = 22,
                    FontWeight = System.Windows.FontWeights.Bold,
                    Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x00, 0xFF, 0xCC))
                };
                TxtStatus = new System.Windows.Controls.TextBlock {
                    Text = "Download Games",
                    FontSize = 12,
                    Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x8A, 0xA0, 0xA0)),
                };
                titlePanel.Children.Add(TxtTitle);
                titlePanel.Children.Add(TxtStatus);
                System.Windows.Controls.Grid.SetRow(titlePanel, 0);
                contentGrid.Children.Add(titlePanel);
                System.Windows.Controls.Panel.SetZIndex(titlePanel, 1);
                // 2. Set background & icon
                System.Windows.Media.ImageSource iconSource = SetupImage("icon.jpg");
                BackgroundImage = new System.Windows.Controls.Image {
                    Stretch = System.Windows.Media.Stretch.UniformToFill,
                    Opacity = 1,
                    MinHeight = 768,
                    MinWidth = 1408,
                    MaxHeight = 768,
                    MaxWidth = 1408,
                };
                System.Windows.Controls.Grid.SetRow(BackgroundImage, 1);
                contentGrid.Children.Add(BackgroundImage);
                System.Windows.Controls.Image iconImage = new System.Windows.Controls.Image {
                    Source = iconSource,
                    Width = 64,
                    Height = 64,
                    HorizontalAlignment = System.Windows.HorizontalAlignment.Left
                };
                System.Windows.Controls.Panel.SetZIndex(BackgroundImage, 0);
                // 3. Action Button layout
                System.Windows.Controls.Grid progressGrid = new System.Windows.Controls.Grid {
                    VerticalAlignment = System.Windows.VerticalAlignment.Bottom
                };
                ProgBar = new System.Windows.Controls.ProgressBar {
                    Height = 20,
                    Minimum = 0,
                    Maximum = 100,
                    Value = 0,
                    BorderThickness = new System.Windows.Thickness(0),
                    Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x1E, 0x1E, 0x1E)),
                    Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x00, 0xFF, 0xCC))
                };
                TxtPercentage = new System.Windows.Controls.TextBlock {
                    Text = "0%",
                    HorizontalAlignment = System.Windows.HorizontalAlignment.Center,
                    VerticalAlignment = System.Windows.VerticalAlignment.Center,
                    FontWeight = System.Windows.FontWeights.Bold,
                    FontSize = 11,
                    Foreground = System.Windows.Media.Brushes.Black
                };
                progressGrid.Children.Add(ProgBar);
                progressGrid.Children.Add(TxtPercentage);
                System.Windows.Controls.Grid.SetRow(progressGrid, 2);
                contentGrid.Children.Add(progressGrid);
                BtnAction = new System.Windows.Controls.Button {
                    Content = "Log in",
                    Height = 20,
                    Width = 120,
                    VerticalAlignment = System.Windows.VerticalAlignment.Bottom,
                    HorizontalAlignment = System.Windows.HorizontalAlignment.Right,
                    FontWeight = System.Windows.FontWeights.Bold,
                    BorderThickness = new System.Windows.Thickness(0),
                    Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x00, 0xFF, 0xCC)),
                    Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x12, 0x12, 0x12)),
                    Visibility = System.Windows.Visibility.Visible
                };
                System.Windows.Controls.Grid.SetRow(BtnAction, 2);
                contentGrid.Children.Add(BtnAction);
                System.Windows.Controls.Grid.SetColumn(contentGrid, 1);
                mainGrid.Children.Add(contentGrid);
            }
            // Setup right-side buttons
            {
                System.Windows.Controls.Border navBorderRight = new System.Windows.Controls.Border {
                    Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x1A, 0x1A, 0x1A)),
                    BorderThickness = new System.Windows.Thickness(5, 0, 0, 0),
                    BorderBrush = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x2D, 0x2D, 0x2D)),
                    Width = NavigationWidth * 2,
                    HorizontalAlignment = System.Windows.HorizontalAlignment.Left,
                    Margin = new System.Windows.Thickness(NavigationWidth + ContentWidth, 0, 0, 0),
                };
                NavBarStackPanelRight = new System.Windows.Controls.StackPanel {
                    Margin = new System.Windows.Thickness(0, 0, 0, 0),
                    Width = NavigationWidth * 2,
                };
                System.Windows.Controls.Grid.SetColumn(navBorderRight, 2);

                navBorderRight.Child = NavBarStackPanelRight;
                mainGrid.Children.Add(navBorderRight);
            }
            // Attach buttons to side bars
            AttachGamesIcons();
            SetupUser();
            Content = mainGrid;
            SwitchGame(_config.Games[0]);
        }

        private System.Windows.Media.ImageSource SetupImage(string filename) {
            System.Reflection.Assembly assembly = System.Reflection.Assembly.GetExecutingAssembly();
            string resourceName = $"{assembly.GetName().Name}.{ResourceFolder}.{filename}";

            using (System.IO.Stream? stream = assembly.GetManifestResourceStream(resourceName)) {
                if (stream == null) {
                    System.Windows.MessageBox.Show($"Could not find embedded resource: {resourceName}", "Failed to set up image");
                }
                System.Windows.Media.Imaging.BitmapImage bitmap = new System.Windows.Media.Imaging.BitmapImage();
                bitmap.BeginInit();
                bitmap.StreamSource = stream;
                bitmap.CacheOption = System.Windows.Media.Imaging.BitmapCacheOption.OnLoad;
                bitmap.EndInit();
                System.Windows.Media.Imaging.WriteableBitmap neutralSource = new System.Windows.Media.Imaging.WriteableBitmap(bitmap);
                neutralSource.Freeze();
                return neutralSource;
            }
        }

        private void SetupConfig() {
            System.Reflection.Assembly assembly = System.Reflection.Assembly.GetExecutingAssembly();
            string resourceName = $"{assembly.GetName().Name}.assets.config.json";
            using (System.IO.Stream? stream = assembly.GetManifestResourceStream(resourceName)) {
                if (stream == null) throw new System.IO.FileNotFoundException("Target configuration missing.");
                using (System.IO.StreamReader reader = new System.IO.StreamReader(stream)) {
                    string jsonText = reader.ReadToEnd();
                    _config = System.Text.Json.JsonSerializer.Deserialize<BaseConfig>(jsonText) ?? new BaseConfig();
                }
            }
        }

        private async void Install_BtnAction_Click(object sender, System.Windows.RoutedEventArgs e) {
            BtnAction.IsEnabled = false;
            Game[] games = _config.Games;
            string installDir = System.IO.Path.Combine(ApplicationSetupDir, CompanyName, SelectedGame.GameName);
            string zipPath = System.IO.Path.Combine(System.IO.Path.GetTempPath(), $"{SelectedGame.GameName}");
            try {
                TxtStatus.Text = "Downloading game assets...";
                await DownloadContent($"{_config.DownloadFolder}/{SelectedGame.GameName.Replace(' ', '+')}/{SelectedGame.ZipFileName}", zipPath);
                TxtStatus.Text = "Extracting binaries...";
                ProgBar.IsIndeterminate = true;
            
                await System.Threading.Tasks.Task.Run(() =>
                {
                    if (System.IO.Directory.Exists(installDir)) System.IO.Directory.Delete(installDir, true);
                    System.IO.Directory.CreateDirectory(installDir);
                    System.IO.Compression.ZipFile.ExtractToDirectory(zipPath, installDir);
                    System.IO.File.Delete(zipPath);
                });
            
                ProgBar.IsIndeterminate = false;
                ProgBar.Value = 100;
                TxtPercentage.Text = "100%";
                TxtStatus.Text = "Installation complete!";
            } catch (System.Exception ex) {
                TxtStatus.Text = $"Installation failed: {ex.Message}";
                ProgBar.IsIndeterminate = false;
                BtnAction.IsEnabled = true;
            }
        }
        
        private void Buy_BtnAction_Click(object sender, System.Windows.RoutedEventArgs e) {
            if (sender is System.Windows.Controls.Button clickedButton) {
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo { FileName = $"${_config.FrontendUrl}/product?productId={clickedButton.Tag}", UseShellExecute = true });
            }
        }

        private void AttachGamesIcons() {
            foreach (Game game in _config.Games) {
                System.Windows.Controls.Button gameIcon = new System.Windows.Controls.Button {
                    Name = game.InternalId,
                    Tag = game,
                    Content = $"Install {game.GameName}",
                    Height = 50,
                    Width = 150,
                    FontWeight = System.Windows.FontWeights.Bold,
                    BorderThickness = new System.Windows.Thickness(0),
                    Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x00, 0xFF, 0xCC)),
                    Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x12, 0x12, 0x12)),
                    Visibility = System.Windows.Visibility.Visible
                };
                gameIcon.Click += Game_BtnAction_Click;
                NavBarStackPanelLeft.Children.Add(gameIcon);
            }
        }
        
        private void Game_BtnAction_Click(object sender, System.Windows.RoutedEventArgs e) {
            if (sender is System.Windows.Controls.Button clickedButton && clickedButton.Tag is Game gameTarget) {
                SwitchGame(gameTarget);
            }
        }
        private void SwitchGame(Game game) {
            System.Windows.Media.ImageSource backgroundSource = SetupImage($"{game.InternalId}.{game.BackgroundImagePath}");
            BackgroundImage.Source = backgroundSource;
            SelectedGame = game;
            BtnAction.Tag = "";
            BtnAction.Content = "";
            if (UserObject == null) {
                BtnAction.Content = "";
            } else {
                if (System.Array.Find(UserObject.PurchasedItems, purchasedItem => purchasedItem.productName.Equals(SelectedGame.GameName)) != null) {
                    BtnAction.Content = "Install";
                    BtnAction.Click += Install_BtnAction_Click;
                } else {
                    BtnAction.Tag = game.ProductId;
                    BtnAction.Content = "Buy";
                    BtnAction.Click += Buy_BtnAction_Click;
                }
            }
        }


        private async System.Threading.Tasks.Task DownloadContent(string url, string destinationPath) {
            System.Windows.MessageBox.Show($"Attempting to download from URL {url}", "Header", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Information);
            try {
                using System.Net.Http.HttpClient client = new System.Net.Http.HttpClient();
                using System.Net.Http.HttpResponseMessage response = await client.GetAsync(url, System.Net.Http.HttpCompletionOption.ResponseHeadersRead);
                response.EnsureSuccessStatusCode();
                long? totalBytes = response.Content.Headers.ContentLength;
                using System.IO.Stream downloadStream = await response.Content.ReadAsStreamAsync();
                using System.IO.FileStream fileStream = new System.IO.FileStream(destinationPath, System.IO.FileMode.Create, System.IO.FileAccess.Write, System.IO.FileShare.None, 8192, true);

                byte[] buffer = new byte[8192];
                long totalReadBytes = 0;
                int readBytes;

                while ((readBytes = await downloadStream.ReadAsync(buffer, 0, buffer.Length)) > 0) {
                    await fileStream.WriteAsync(buffer, 0, readBytes);
                    totalReadBytes += readBytes;

                    if (totalBytes.HasValue) {
                        double progress = (double)totalReadBytes / totalBytes.Value * 100;
                        // Update progress bar on UI thread smoothly
                        Dispatcher.Invoke(() => {
                            ProgBar.Value = progress;
                            TxtPercentage.Text = $"{System.Math.Round(progress)}%";
                        });
                    }
                }
            } catch (System.Exception ex) {
                System.Windows.MessageBox.Show(ex.Message, "Failed to set up launcher", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Information);
            }
        }

        private void SetupUser() {
            string resourceName = System.IO.Path.Combine(ApplicationSetupDir, "UserConfig.json");
            if (!System.IO.File.Exists(resourceName)) {
                System.IO.File.WriteAllText(resourceName, "{\"AccessToken\":\"\",\"Username\":\"\",\"PurchasedGames\":[]}");
                UserObject = new User();
                return;
            }
            using (System.IO.Stream stream = System.IO.File.OpenRead(resourceName)) {
                if (stream == null) throw new System.IO.FileNotFoundException("User configuration missing.");
                using (System.IO.StreamReader reader = new System.IO.StreamReader(stream)) {
                    string jsonText = reader.ReadToEnd();
                    UserObject = System.Text.Json.JsonSerializer.Deserialize<User>(jsonText) ?? new User();
                }
            }
            if (UserObject.Username.Equals("")) {
                SwitchBetweenLoginLogout("login");
            } else {
                SwitchBetweenLoginLogout("logout");
            }
        }
        private void SwitchBetweenLoginLogout(string destination) {
            string buttonName = null!;
            string buttonTag = null!;
            string buttonContent = null!;
            System.Windows.Controls.TextBlock? usernameBlock = null;
            if (destination.Equals("login")) {
                buttonName = "Login";
                buttonTag = "Login";
                buttonContent = "Log in";
            }
            if (destination.Equals("logout")) {
                buttonName = "Logout";
                buttonTag = "Logout";
                buttonContent = "Log out";
                usernameBlock = new System.Windows.Controls.TextBlock {
                    Text = $"Welcome, {UserObject.Username}!",
                    FontSize = 22,
                    FontWeight = System.Windows.FontWeights.Bold,
                    Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x00, 0xFF, 0xCC)),
                    HorizontalAlignment = System.Windows.HorizontalAlignment.Center,
                    VerticalAlignment = System.Windows.VerticalAlignment.Top,
                };
            }
            LogButton = new System.Windows.Controls.Button {
                Name = buttonName,
                Tag = buttonTag,
                Content = buttonContent,
                Height = 50,
                Width = NavigationWidth,
                FontWeight = System.Windows.FontWeights.Bold,
                BorderThickness = new System.Windows.Thickness(0),
                Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x00, 0xFF, 0xCC)),
                Foreground = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x12, 0x12, 0x12)),
                Visibility = System.Windows.Visibility.Visible,
                HorizontalAlignment = System.Windows.HorizontalAlignment.Center,
            };
            LogButton.Click += Log_BtnAction_Click;
            NavBarStackPanelRight.Children.Clear();
            if (usernameBlock != null) {
                NavBarStackPanelRight.Children.Add(usernameBlock);
            }
            NavBarStackPanelRight.Children.Add(LogButton);
        }
        private async void Log_BtnAction_Click(object sender, System.Windows.RoutedEventArgs e) {
            LogButton.IsEnabled = false;
            try {
                if (sender is System.Windows.Controls.Button clickedButton) {
                    string userData = null!;
                    string userDataFile = System.IO.Path.Combine(ApplicationSetupDir, "UserConfig.json");
                    string tokenUrl = $"{_config.Cognito.CognitoDomain}/oauth2/token";
                    if (clickedButton.Tag.Equals("Login")) {
                        System.Collections.Generic.Dictionary<string, string> loginDetails = await AuthenticateUserWithCognitoAsync();
                        loginDetails.TryGetValue("accessToken", out string? accessToken);
                        loginDetails.TryGetValue("username", out string? username);
                        if (accessToken == null || username == null) {
                            System.Windows.MessageBox.Show("Failed to log in", "Login failed", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Information);
                        }
                        UserObject.Username = username!;
                        UserObject.AccessToken = accessToken!;
                        UserObject.PurchasedItems = await GetPurchasedGames();
                        SwitchBetweenLoginLogout("logout");
                    }
                    if (clickedButton.Tag.Equals("Logout")) {
                        UserObject = new User();
                        SwitchBetweenLoginLogout("login");
                    }
                    System.Text.Json.JsonSerializerOptions options = new System.Text.Json.JsonSerializerOptions {
                        WriteIndented = true
                    };
                    userData = System.Text.Json.JsonSerializer.Serialize(UserObject, options);
                    System.IO.File.WriteAllText(userDataFile, userData);
                }
            } catch (System.Exception ex) {
                System.Windows.MessageBox.Show($"Failed to process login due to {ex.Message}");
            } finally {
                LogButton.IsEnabled = true;
            }
        }
        private async System.Threading.Tasks.Task<System.Collections.Generic.Dictionary<string, string>> AuthenticateUserWithCognitoAsync() {
            System.Net.HttpListener listener = new System.Net.HttpListener();
            listener.Prefixes.Add($"{_config.Cognito.RedirectUri}/");
            listener.Prefixes.Add($"https://127.0.0.1:4200/");
            listener.Start();
            codeVerifier = GenerateCodeChallenge(GenerateCryptoString(64));
            string codeChallenge = GenerateCodeChallenge(codeVerifier);
            string authUrl = $"https://{_config.Cognito.CognitoDomain}/login?" +
                $"client_id={_config.Cognito.ClientId}" +
                $"&code_challenge={codeChallenge}" +
                $"&code_challenge_method=S256" +
                $"&redirect_uri={_config.Cognito.RedirectUri}" +
                $"&response_type=code" +
                $"&scope=aws.cognito.signin.user.admin+email+openid+profile" +
                $"&state={GenerateCryptoString(32).ToLower()}";
            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo { FileName = authUrl, UseShellExecute = true });

            System.Net.HttpListenerContext context = await listener.GetContextAsync();
            System.Net.HttpListenerRequest request = context.Request;
            string? authCode = request.QueryString["code"];

            using (System.Net.HttpListenerResponse response = context.Response) {
                string responseString = "<html><body><h2>Login successful! You can close this tab.</h2></body></html>";
                byte[] buffer = System.Text.Encoding.UTF8.GetBytes(responseString);
                response.ContentLength64 = buffer.Length;
                await response.OutputStream.WriteAsync(buffer, 0, buffer.Length);
            }
            listener.Stop();
            System.Collections.Generic.Dictionary<string, string> loginDetails = await ExchangeCodeForTokensAsync(authCode);
            return loginDetails;
        }
        private async System.Threading.Tasks.Task<System.Collections.Generic.Dictionary<string, string>> ExchangeCodeForTokensAsync(string authCode) {
            string tokenUrl = $"https://{_config.Cognito.CognitoDomain}/oauth2/token";
            System.Collections.Generic.Dictionary<string, string> inputs = new System.Collections.Generic.Dictionary<string, string> {
                { "grant_type", "authorization_code" },
                { "client_id", _config.Cognito.ClientId },
                { "code", authCode },
                { "redirect_uri", $"{_config.Cognito.RedirectUri}" },
                { "code_verifier", codeVerifier },
            };
            System.Collections.Generic.Dictionary<string, string> output = new System.Collections.Generic.Dictionary<string, string>();
            using (System.Net.Http.HttpClient client = new System.Net.Http.HttpClient()) {
                System.Net.Http.HttpResponseMessage response = await client.PostAsync(tokenUrl, new System.Net.Http.FormUrlEncodedContent(inputs)).ConfigureAwait(false);
                string jsonResponse = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
                if (!response.IsSuccessStatusCode) {
                    throw new System.Net.Http.HttpRequestException($"Cognito token swap failed: {response.StatusCode}, {jsonResponse}");
                }
                using (System.Text.Json.JsonDocument doc = System.Text.Json.JsonDocument.Parse(jsonResponse)) {
                    System.Text.Json.JsonElement root = doc.RootElement;
                    string idToken = root.GetProperty("id_token").GetString() ?? "";
                    string accessToken = root.GetProperty("access_token").GetString() ?? "";
                    output.Add("accessToken", accessToken);

                    System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                    if (handler.CanReadToken(idToken)) {
                        System.IdentityModel.Tokens.Jwt.JwtSecurityToken jwtToken = handler.ReadJwtToken(idToken);
                        output.Add("username", jwtToken.Claims.FirstOrDefault(c => c.Type == "cognito:username").Value);
                    }
                }
            }
            return output;
        }
        private string GenerateCryptoString(int length) {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            System.Text.StringBuilder result = new System.Text.StringBuilder();
            using (System.Security.Cryptography.RandomNumberGenerator rng = System.Security.Cryptography.RandomNumberGenerator.Create()) {
                byte[] data = new byte[1];
                while (result.Length < length) {
                    rng.GetBytes(data);
                    char c = (char)data[0];
                    if (chars.Contains(c)) result.Append(c);
                }
            }
            return result.ToString();
        }
        private string GenerateCodeChallenge(string codeVerifier) {
            using (System.Security.Cryptography.SHA256 sha256 = System.Security.Cryptography.SHA256.Create()) {
                byte[] challengeBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(codeVerifier));
                return System.Convert.ToBase64String(challengeBytes)
                    .Replace("+", "_")
                    .Replace("/", "_")
                    .TrimEnd('=');
            }
        }
        private async System.Threading.Tasks.Task<PurchasedItem[]> GetPurchasedGames() {
            PurchasedItem[] items = null!;
            using (System.Net.Http.HttpClient client = new System.Net.Http.HttpClient()) {
                using (System.Net.Http.HttpRequestMessage req = new System.Net.Http.HttpRequestMessage(System.Net.Http.HttpMethod.Get, $"{_config.BackendUrl}/purchased-games")) {
                    req.Headers.Add("Accept", "application/json");
                    req.Headers.Add("Authorization", $"Bearer {UserObject.AccessToken}");
                    System.Net.Http.HttpResponseMessage response = await client.SendAsync(req).ConfigureAwait(false);
                    string jsonResponse = (await response.Content.ReadAsStringAsync().ConfigureAwait(false)).Trim('"').Replace("\\\"", "\"");
                    System.Text.Json.JsonSerializerOptions jsonOptions = new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    items = System.Text.Json.JsonSerializer.Deserialize<PurchasedItem[]>(jsonResponse, jsonOptions) ?? System.Array.Empty<PurchasedItem>();
                }
            }
            return items;
        }
    }
}
