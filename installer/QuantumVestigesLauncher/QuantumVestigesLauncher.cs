namespace QuantumVestigesInstaller {
    class Game {
        public string ZipFileName { get; set; } = "";
        public string GameName { get; set; } = "";
        public string GameVersion { get; set; } = "";
        public string BackgroundImagePath { get; set; } = "";
        public string InternalId { get; set; } = "";
    }
    class BaseConfig {
        public string Env { get; set; } = "";
        public string DownloadFolder { get; set; } = "";
        public Game[] Games { get; set; } = System.Array.Empty<Game>();
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
        private System.Windows.Controls.TextBlock TxtTitle;
        private System.Windows.Controls.TextBlock TxtStatus;
        private System.Windows.Controls.Button BtnAction;
        private System.Windows.Controls.Grid mainGrid;
        private System.Windows.Controls.ProgressBar ProgBar;
        private System.Windows.Controls.TextBlock TxtPercentage;
        private System.Windows.Controls.Image BackgroundImage;
        private System.Windows.Controls.StackPanel NavBarStackPanel;
        private Game SelectedGame = new Game();
        private BaseConfig _config;
        // Directory setup
        private string CompanyName = "Quantum Vestiges";
        private string ApplicationData = System.Environment.GetFolderPath(System.Environment.SpecialFolder.ApplicationData);
        private string ApplicationSetupDir;

        public QuantumVestigesWindow () {
            Title = CompanyName;
            Height = 768 + 40;
            Width = 1408 + 150 + 20;
            WindowStartupLocation = System.Windows.WindowStartupLocation.CenterScreen;
            Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x12, 0x12, 0x12));
            ApplicationSetupDir = System.IO.Path.Combine(ApplicationData, CompanyName);
            SetupConfig();
            BuildManualLayout();
        }
        private void BuildManualLayout() {
            // Core layout grid
            mainGrid = new System.Windows.Controls.Grid { };
            mainGrid.RowDefinitions.Add(new System.Windows.Controls.RowDefinition { Height = System.Windows.GridLength.Auto });
            mainGrid.RowDefinitions.Add(new System.Windows.Controls.RowDefinition { Height = new System.Windows.GridLength(1, System.Windows.GridUnitType.Star) });
            mainGrid.RowDefinitions.Add(new System.Windows.Controls.RowDefinition { Height = System.Windows.GridLength.Auto });
            System.Windows.Controls.Border navBorder = new System.Windows.Controls.Border {
                Background = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x1A, 0x1A, 0x1A)),
                BorderThickness = new System.Windows.Thickness(0, 0, 5, 0),
                BorderBrush = new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x2D, 0x2D, 0x2D)),
                MaxWidth = 150,
                HorizontalAlignment = System.Windows.HorizontalAlignment.Left,
            };
            NavBarStackPanel = new System.Windows.Controls.StackPanel {
                Margin = new System.Windows.Thickness(0, 0, 0, 0),
                MaxWidth = 150,
            };
            System.Windows.Controls.Grid.SetColumn(navBorder, 0);

            navBorder.Child = NavBarStackPanel;
            mainGrid.Children.Add(navBorder);
            // 1. Title and Status block
            System.Windows.Controls.Grid contentGrid = new System.Windows.Controls.Grid {
                HorizontalAlignment = System.Windows.HorizontalAlignment.Left,
                Margin = new System.Windows.Thickness(150, 0, 0, 0),
            };
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
            System.Windows.Media.ImageSource backgroundSource = SetupImage(SelectedGame.BackgroundImagePath);
            System.Windows.Media.ImageSource iconSource = SetupImage("icon.png");
            BackgroundImage = new System.Windows.Controls.Image {
                Stretch = System.Windows.Media.Stretch.UniformToFill,
                Source = backgroundSource,
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
            // 3. Attach Game icons
            AttachGamesIcons();
            // 4. Action Button layout
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
                Content = "INSTALL",
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
            BtnAction.Click += Install_BtnAction_Click;
            System.Windows.Controls.Grid.SetRow(BtnAction, 2);
            contentGrid.Children.Add(BtnAction);
            System.Windows.Controls.Grid.SetColumn(contentGrid, 1);
            mainGrid.Children.Add(contentGrid);
            Content = mainGrid;
        }

        private System.Windows.Media.ImageSource SetupImage(string filename) {
            try {
                System.Reflection.Assembly assembly = System.Reflection.Assembly.GetExecutingAssembly();
                string resourceName = $"{assembly.GetName().Name}.{ResourceFolder}.{filename}";

                using (System.IO.Stream stream = assembly.GetManifestResourceStream(resourceName)) {
                    if (stream == null) {
                        throw new System.IO.FileNotFoundException($"Could not find embedded resource: {resourceName}");
                    }
                    // 3. Decode the stream into a safe, thread-detached WriteableBitmap
                    System.Windows.Media.Imaging.BitmapImage bitmap = new System.Windows.Media.Imaging.BitmapImage();
                    bitmap.BeginInit();
                    bitmap.StreamSource = stream;
                    bitmap.CacheOption = System.Windows.Media.Imaging.BitmapCacheOption.OnLoad;
                    bitmap.EndInit();
                    System.Windows.Media.Imaging.WriteableBitmap neutralSource = new System.Windows.Media.Imaging.WriteableBitmap(bitmap);
                    neutralSource.Freeze();
                    return neutralSource;
                }
            } catch (System.Exception ex) {
                return null;
            }
        }

        private void SetupConfig() {
            System.Reflection.Assembly assembly = System.Reflection.Assembly.GetExecutingAssembly();
            string resourceName = $"{assembly.GetName().Name}.assets.config.json";
            using (System.IO.Stream stream = assembly.GetManifestResourceStream(resourceName)) {
                if (stream == null) throw new System.IO.FileNotFoundException("Target configuration missing.");
                using (System.IO.StreamReader reader = new System.IO.StreamReader(stream)) {
                    string jsonText = reader.ReadToEnd();
                    _config = System.Text.Json.JsonSerializer.Deserialize<BaseConfig>(jsonText) ?? new BaseConfig();
                }
                SelectedGame = _config.Games[0];
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
                NavBarStackPanel.Children.Add(gameIcon);
            }
        }
        
        private async void Game_BtnAction_Click(object sender, System.Windows.RoutedEventArgs e) {
            if (sender is System.Windows.Controls.Button clickedButton && clickedButton.Tag is Game gameTarget) {
                SelectedGame = gameTarget;
                System.Windows.MessageBox.Show($"New ID {gameTarget.InternalId}, found game background {gameTarget.BackgroundImagePath}", "Header", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Information);
                System.Windows.Media.ImageSource backgroundSource = SetupImage(gameTarget.BackgroundImagePath);
                BackgroundImage.Source = backgroundSource;
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
    }
}
